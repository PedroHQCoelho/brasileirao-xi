import {
  readFile,
  writeFile,
  mkdir,
  unlink,
  rename,
} from "node:fs/promises";

import { playerPositionOverrides } from "./player-position-overrides.js";

const API_URL = "https://brasileirao-serie-a.p.rapidapi.com";
const API_HOST = "brasileirao-serie-a.p.rapidapi.com";

const API_KEY = process.env.RAPIDAPI_KEY;

const SEASON = 2026;
const MAX_REQUESTS = 150;
const MAX_RETRIES = 2;
const REQUEST_DELAY = 300;

const OUTPUT_FILE = "src/data/players.full-import.json";
const PROGRESS_FILE = "src/data/players.import-progress.json";

const VALID_POSITIONS = new Set([
  "GK", "RB", "CB", "LB", "RWB", "LWB",
  "DM", "CM", "AM", "RW", "LW", "ST",
]);

let requestCount = 0;
let lastRequestTime = 0;

if (!API_KEY) {
  throw new Error(
    "Chave da API não encontrada. Confira o arquivo .env."
  );
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

 // Consulta a API com limite de chamadas e retentativas.
async function fetchAPI(endpoint) {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (requestCount >= MAX_REQUESTS) {
      throw new Error(
        `Limite de segurança atingido: ${MAX_REQUESTS} chamadas.`
      );
    }

    const elapsed = Date.now() - lastRequestTime;

    if (elapsed < REQUEST_DELAY) {
      await sleep(REQUEST_DELAY - elapsed);
    }

    requestCount++;
    lastRequestTime = Date.now();

    let response;

    try {
      response = await fetch(`${API_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "x-rapidapi-host": API_HOST,
          "x-rapidapi-key": API_KEY,
        },
      });
    } catch (error) {
      if (attempt === MAX_RETRIES) {
        throw error;
      }

      console.warn(
        `Falha na requisição ${endpoint}. ` +
        `Tentativa ${attempt + 1}/${MAX_RETRIES}.`
      );

      await sleep(1000 * (attempt + 1));
      continue;
    }

    if (response.ok) {
      return response.json();
    }

    const errorText = await response.text();

    const error = new Error(
      `Erro na API (${response.status}): ${errorText}`
    );

    // Erros 4xx, exceto 429, não são repetidos.
    if (
      response.status !== 429 &&
      response.status < 500
    ) {
      throw error;
    }

    if (attempt === MAX_RETRIES) {
      throw error;
    }

    console.warn(
      `Falha na requisição ${endpoint}. ` +
      `Tentativa ${attempt + 1}/${MAX_RETRIES}.`
    );

    await sleep(1000 * (attempt + 1));
  }
}

function getTeamName(team) {
  return team?.name ?? team?.shortName ?? "Clube desconhecido";
}

function normalizeName(name) {
  return String(name ?? "")
    .trim()
    .replace(/\s+/g, " ");
}

function normalizePosition(position) {
  const normalized = String(position ?? "").toUpperCase();

  if (normalized === "SS") {
    return "ST";
  }

  return normalized;
}

// Adiciona ou atualiza um jogador no Map.
function addPlayer(players, item, team, kickoff) {
  const apiPlayer = item.player;

  if (!apiPlayer?.id || !apiPlayer?.name) {
    return false;
  }

  const minutes = Number(item.minutes);

  if (!Number.isFinite(minutes) || minutes <= 0) {
    return false;
  }

  const id = Number(apiPlayer.id);

  if (!Number.isFinite(id)) {
    return false;
  }

  const name = normalizeName(apiPlayer.name);
  const clubName = getTeamName(team);
  const position = normalizePosition(item.position);

  if (!players.has(id)) {
    players.set(id, {
      id,
      name,
      club: clubName,
      clubs: [],
      photo: apiPlayer.photoUrl ?? "",
      positions: [],
      clubCrest: team?.crestUrl ?? "",
      lastAppearanceDate: "",
    });
  }

  const player = players.get(id);

  if (!player.clubs.includes(clubName)) {
    player.clubs.push(clubName);
  }

  if (
    !player.lastAppearanceDate ||
    kickoff >= player.lastAppearanceDate
  ) {
    player.club = clubName;
    player.clubCrest = team?.crestUrl ?? "";
    player.lastAppearanceDate = kickoff;
  }

  if (
    VALID_POSITIONS.has(position) &&
    !player.positions.includes(position)
  ) {
    player.positions.push(position);
  } else if (position && !VALID_POSITIONS.has(position)) {
    console.warn(
      `Posição não reconhecida: ${position} (${name})`
    );
  }

  return true;
}

// Aplica as correções manuais de posições.
function applyPositionOverrides(player) {
  const override = playerPositionOverrides[player.id];

  if (!override) {
    return player;
  }

  const overridePositions = [
    override.primary,
    ...(override.secondary ?? []),
  ].filter((position) => VALID_POSITIONS.has(position));

  return {
    ...player,
    positions: [
      ...new Set([
        ...overridePositions,
        ...player.positions,
      ]),
    ],
  };
}

// Salva o progresso com substituição segura do arquivo principal.
async function saveProgress(players, processedMatchIds) {
  const TEMP_FILE = `${PROGRESS_FILE}.tmp`;

  const content = JSON.stringify(
    {
      season: SEASON,
      processedMatchIds: [...processedMatchIds],
      players: [...players.values()],
    },
    null,
    2
  );

  // Primeiro grava o conteúdo em um arquivo temporário.
  await writeFile(TEMP_FILE, content, "utf-8");

  // Só substitui o arquivo principal após a gravação.
  await rename(TEMP_FILE, PROGRESS_FILE);
}


// Carrega um progresso anterior, se existir.
async function loadProgress() {
  try {
    const content = await readFile(PROGRESS_FILE, "utf-8");
    const saved = JSON.parse(content);

    if (saved.season !== SEASON) {
      throw new Error(
        "O arquivo de progresso pertence a outra temporada."
      );
    }

    const players = new Map(
      saved.players.map((player) => [player.id, player])
    );

    const processedMatchIds = new Set(
      saved.processedMatchIds.map(String)
    );

    console.log(
      `Progresso recuperado: ${processedMatchIds.size} partidas.`
    );

    return { players, processedMatchIds };
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("Nenhum progresso anterior encontrado.");
      return {
        players: new Map(),
        processedMatchIds: new Set(),
      };
    }

    throw error;
  }
}

async function main() {
  console.log("==================================");
  console.log(" BRASILEIRÃO XI - IMPORTAÇÃO COMPLETA");
  console.log("==================================");

  await mkdir("src/data", { recursive: true });

  const { players, processedMatchIds } = await loadProgress();

  // 1. Busca as duas páginas de partidas.
  console.log("\nBuscando partidas da temporada...");

  const page1 = await fetchAPI(
    `/matches?season=${SEASON}&page=1&limit=200`
  );

  const page2 = await fetchAPI(
    `/matches?season=${SEASON}&page=2&limit=200`
  );

  const matches = [
    ...(page1.data ?? []),
    ...(page2.data ?? []),
  ];

  console.log("Partidas encontradas:", matches.length);
  console.log("Total informado pela API:", page1.meta?.total ?? "N/D");

  // 2. Filtra partidas finalizadas.
  const finishedStatuses = new Set([
    "finished",
    "ft",
    "full_time",
    "full-time",
  ]);

  const finishedMatches = matches
    .filter((match) =>
      finishedStatuses.has(
        String(match.status ?? "").toLowerCase()
      )
    )
    .sort((a, b) =>
      String(a.kickoff).localeCompare(String(b.kickoff))
    );

  console.log(
    "Partidas finalizadas encontradas:",
    finishedMatches.length
  );

  if (finishedMatches.length === 0) {
    throw new Error("Nenhuma partida finalizada foi encontrada.");
  }

  // 3. Seleciona somente partidas ainda não processadas.
  const pendingMatches = finishedMatches.filter(
    (match) => !processedMatchIds.has(String(match.id))
  );

  console.log("Partidas já processadas:", processedMatchIds.size);
  console.log("Partidas pendentes:", pendingMatches.length);

  // 4. Consulta os detalhes de cada partida.
  console.log("\nIniciando importação...");

  for (let index = 0; index < pendingMatches.length; index++) {
    const listedMatch = pendingMatches[index];

    const completed = processedMatchIds.size;

    console.log(
      `\nProgresso: ${completed + 1}/${finishedMatches.length}`
    );

    console.log(`ID da partida: ${listedMatch.id}`);

    const detailResponse = await fetchAPI(
      `/matches/${listedMatch.id}`
    );

    const match = detailResponse.data ?? detailResponse;
    const lineups = match.lineups;

    if (!lineups) {
      console.warn(
        `Partida ${listedMatch.id} sem escalações disponíveis.`
      );

      // Não repete indefinidamente partidas sem escalações.
      processedMatchIds.add(String(listedMatch.id));
      await saveProgress(players, processedMatchIds);
      continue;
    }

    const kickoff = match.kickoff ?? listedMatch.kickoff;

    console.log(
      `${getTeamName(match.homeTeam)} x ${getTeamName(match.awayTeam)}`
    );

    for (const side of ["home", "away"]) {
      const lineup = lineups[side];

      if (!lineup) {
        console.warn(`Escalação ${side} não encontrada.`);
        continue;
      }

      const team =
        side === "home"
          ? match.homeTeam
          : match.awayTeam;

      const participants = [
        ...(lineup.starting ?? []),
        ...(lineup.bench ?? []),
      ];

      let appearances = 0;

      for (const item of participants) {
        if (addPlayer(players, item, team, kickoff)) {
          appearances++;
        }
      }

      console.log(
        `${getTeamName(team)}: ${appearances} participações.`
      );
    }

    processedMatchIds.add(String(listedMatch.id));

    // Salva após cada partida concluída.
    await saveProgress(players, processedMatchIds);

    console.log(
      `Chamadas realizadas nesta execução: ${requestCount}/${MAX_REQUESTS}`
    );
  }

  // 5. Prepara a lista final.
  const playerList = Array.from(players.values())
    .map((player) => {
      const correctedPlayer = applyPositionOverrides(player);

      const {
        lastAppearanceDate,
        ...finalPlayer
      } = correctedPlayer;

      return finalPlayer;
    })
    .sort((a, b) =>
      a.name.localeCompare(b.name, "pt-BR")
    );

  // 6. Gera o arquivo final.
  await writeFile(
    OUTPUT_FILE,
    JSON.stringify(playerList, null, 2),
    "utf-8"
  );

  // Remove o arquivo temporário somente após a conclusão.
  await unlink(PROGRESS_FILE);

  // 7. Apresenta o resultado.
  console.log("\n==================================");
  console.log(" IMPORTAÇÃO COMPLETA CONCLUÍDA");
  console.log("==================================");

  console.log("Partidas finalizadas:", finishedMatches.length);
  console.log("Partidas processadas:", processedMatchIds.size);
  console.log("Jogadores únicos:", playerList.length);
  console.log("Chamadas nesta execução:", requestCount);
  console.log("Arquivo gerado:", OUTPUT_FILE);

  console.log("\nCorreções manuais aplicadas:");

  for (const player of playerList) {
    if (playerPositionOverrides[player.id]) {
      console.log(
        `- ${player.name}: ${player.positions.join(", ")}`
      );
    }
  }
}

main().catch((error) => {
  console.error("\nFalha na importação:", error.message);
  console.error(
    `Chamadas realizadas nesta execução: ${requestCount}/${MAX_REQUESTS}`
  );
  console.error(
    "O progresso salvo foi preservado, se alguma partida já foi concluída."
  );
  process.exitCode = 1;
});