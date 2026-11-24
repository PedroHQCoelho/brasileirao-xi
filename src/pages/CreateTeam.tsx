import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Plus, Save, Trash2, UserRound } from "lucide-react";

import { categories } from "../data/categories";
import { formations, goalkeeperSlot } from "../data/formations";
import { players } from "../data/players";
import { coaches } from "../data/coaches";

import type { Player } from "../types/player";
import type { Coach } from "../types/coach";
import type { Formation, FormationSlot } from "../data/formations";

import { FormationSelector } from "../components/FormationSelector";
import { FootballPitch } from "../components/FootballPitch";
import { PlayerSelector } from "../components/PlayerSelector";
import { CoachSelector } from "../components/CoachSelector";
import { MentionSelector } from "../components/MentionSelector";

import { saveLineup } from "../services/lineupStorage";

interface FormationSlotEntry {
  id: string;
  slot: FormationSlot;
}

// Converte as linhas da formação em vagas identificáveis.
function getFormationSlots(formation: Formation): FormationSlotEntry[] {
  return formation.lines.flatMap((line, lineIndex) =>
    line.map((slot, playerIndex) => ({
      id: `${formation.id}-${lineIndex}-${playerIndex}`,
      slot,
    }))
  );
}

// Distribui os jogadores nas vagas compatíveis, aproveitando o máximo possível.
function arrangePlayers(
  formation: Formation,
  selectedPlayers: Record<string, Player>
): Record<string, Player> {
  const slots = getFormationSlots(formation);

  // Reúne titulares e reservas, sem duplicar jogadores.
  const uniquePlayers = Array.from(
    new Map(
      Object.entries(selectedPlayers)
        .filter(([id]) => id !== "goalkeeper")
        .map(([, player]) => [player.id, player] as const)
    ).values()
  );

  // Jogadores com menos possibilidades são priorizados.
  const orderedPlayers = [...uniquePlayers].sort((a, b) => {
    const optionsA = slots.filter(({ slot }) =>
      a.positions.some((position) =>
        slot.acceptedPositions.includes(position)
      )
    ).length;

    const optionsB = slots.filter(({ slot }) =>
      b.positions.some((position) =>
        slot.acceptedPositions.includes(position)
      )
    ).length;

    return optionsA - optionsB;
  });

  const assignments = new Map<string, Player>();

  // Tenta encaixar um jogador, reorganizando outro se necessário.
  function tryAssign(
    player: Player,
    visitedSlots: Set<string>
  ): boolean {
    for (const { id, slot } of slots) {
      const compatible = player.positions.some((position) =>
        slot.acceptedPositions.includes(position)
      );

      if (!compatible || visitedSlots.has(id)) continue;

      visitedSlots.add(id);

      const occupant = assignments.get(id);

      if (!occupant || tryAssign(occupant, visitedSlots)) {
        assignments.set(id, player);
        return true;
      }
    }

    return false;
  }

  orderedPlayers.forEach((player) => {
    tryAssign(player, new Set<string>());
  });

  const result: Record<string, Player> = {};

  // Preserva o goleiro independentemente da formação.
  if (selectedPlayers.goalkeeper) {
    result.goalkeeper = selectedPlayers.goalkeeper;
  }

  // Salva os jogadores que encontraram uma vaga.
  assignments.forEach((player, slotId) => {
    result[slotId] = player;
  });

  // Preserva os demais na área de reposicionamento.
  const assignedIds = new Set(
    Array.from(assignments.values()).map((player) => player.id)
  );

  uniquePlayers.forEach((player) => {
    if (!assignedIds.has(player.id)) {
      result[`reserve-${player.id}`] = player;
    }
  });

  return result;
}

export function CreateTeam() {
  
const [searchParams] = useSearchParams();

// Verifica se a categoria veio da página inicial.
const requestedCategoryId = searchParams.get("categoria");

const categoryFromUrl = categories.find(
  (item) => item.id === requestedCategoryId
);

// Permite escolher uma categoria quando nenhuma veio pela URL.
const [selectedCategoryId, setSelectedCategoryId] = useState(
  categoryFromUrl?.id ?? ""
);

// Recupera a categoria efetivamente selecionada.
const category = categories.find(
  (item) => item.id === selectedCategoryId
);

// Atualiza o título das menções conforme a categoria.
const mentionTitle =
  selectedCategoryId === "best" ||
  selectedCategoryId === "surprises"
    ? "Menções honrosas"
    : selectedCategoryId === "worst" ||
        selectedCategoryId === "disappointments"
      ? "Menções desonrosas"
      : "Menções";

  const [selectedFormation, setSelectedFormation] = useState("4-3-3");

  // Todas as vagas usam o mesmo estado.
  // A chave "goalkeeper" representa a vaga fixa do goleiro.
  const [selectedPlayers, setSelectedPlayers] = useState<
    Record<string, Player>
  >({});

  // O treinador é independente dos 11 jogadores.
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [isCoachSelectorOpen, setIsCoachSelectorOpen] = useState(false);

  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);

  const formation =
    formations.find((item) => item.id === selectedFormation) ?? formations[0];

  // Menções de jogadores e treinadores.
  const [mentionedPlayers, setMentionedPlayers] = useState<Player[]>([]);
  const [mentionedCoaches, setMentionedCoaches] = useState<Coach[]>([]);

  const [mentionSelectorType, setMentionSelectorType] = useState<
    "player" | "coach" | null
  >(null);

  // Identifica todas as vagas de linha da formação atual.
  const formationSlots = getFormationSlots(formation);

  const activeSlotIds = new Set([
    "goalkeeper",
    ...formationSlots.map(({ id }) => id),
  ]);

  // Descobre as informações da vaga que foi clicada.
  const activeSlot: FormationSlot | undefined = activeSlotId
  ? activeSlotId === "goalkeeper"
    ? goalkeeperSlot
    : formationSlots.find((item) => item.id === activeSlotId)?.slot
  : undefined;

  // O jogador da vaga ativa pode aparecer novamente no modal,
  // permitindo substituí-lo sem duplicar jogadores em outras posições.
  const selectedPlayerIds = new Set([
  ...Object.entries(selectedPlayers)
    .filter(
      ([slotId]) =>
        activeSlotIds.has(slotId) && slotId !== activeSlotId
    )
    .map(([, player]) => player.id),

  ...mentionedPlayers.map((player) => player.id),
  ]);

  // Jogadores de formações anteriores ficam preservados temporariamente.
  const reservePlayers = Object.entries(selectedPlayers)
    .filter(([slotId]) => !activeSlotIds.has(slotId))
    .map(([, player]) => player);

  const startingPlayers = Object.entries(selectedPlayers)
    .filter(([slotId]) => activeSlotIds.has(slotId));

  
  function handleSaveLineup() {
    // Verifica se a seleção possui uma categoria válida.
    if (!category) {
      alert("Selecione uma categoria antes de salvar sua seleção.");
      return;
    }

    // Exige os 11 titulares completos.
    if (startingPlayers.length !== 11) {
      alert("Complete os 11 jogadores titulares antes de salvar.");
      return;
    }

    // Solicita um nome para a seleção.
    const name = window.prompt("Qual será o nome da sua seleção?");

    if (!name || !name.trim()) {
      return;
    }

    try {
      saveLineup({
        id: crypto.randomUUID(),
        name: name.trim(),
        season: 2026,
        category: category.id,
        formation: selectedFormation,
        selectedPlayers,
        coach: selectedCoach,
        mentionedPlayers,
        mentionedCoaches,
        createdAt: new Date().toISOString(),
      });

      alert("Sua seleção foi salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar seleção:", error);
      alert("Não foi possível salvar sua seleção.");
    }
  }  

  function handlePlayerSelect(player: Player) {
  if (!activeSlotId) return;

    setSelectedPlayers((current) => {
      // Retira o jogador de sua vaga ou reserva anterior.
      const updated = Object.fromEntries(
        Object.entries(current).filter(
          ([, currentPlayer]) => currentPlayer.id !== player.id
        )
      ) as Record<string, Player>;

      updated[activeSlotId] = player;

      return updated;
      });

      setActiveSlotId(null);
  }

  function handleFormationChange(nextFormationId: string) {
  const nextFormation = formations.find(
    (item) => item.id === nextFormationId
  );

  if (!nextFormation) return;

  setSelectedPlayers((current) =>
    arrangePlayers(nextFormation, current)
  );

  setSelectedFormation(nextFormationId);
  setActiveSlotId(null);
  }

  function handlePlayerRemove() {
    if (!activeSlotId) return;

    setSelectedPlayers((current) => {
      const updated = { ...current };

      delete updated[activeSlotId];

      return updated;
    });

    setActiveSlotId(null);
  }

  function handleCoachSelect(coach: Coach) {
    setSelectedCoach(coach);
    setIsCoachSelectorOpen(false);
  }

  function handleCoachRemove() {
    setSelectedCoach(null);
    setIsCoachSelectorOpen(false);
  }

  function handleMentionPlayerSelect(item: Player | Coach) {
  if (!("positions" in item)) return;

  setMentionedPlayers((current) => {
    if (
      current.length >= 10 ||
      current.some((player) => player.id === item.id)
    ) {
      return current;
    }

    return [...current, item];
  });

  setMentionSelectorType(null);
}

  function handleMentionCoachSelect(item: Player | Coach) {
    if (!("stints" in item)) return;

    setMentionedCoaches((current) => {
      if (
        current.length >= 2 ||
        item.id === selectedCoach?.id ||
        current.some((coach) => coach.id === item.id)
      ) {
        return current;
      }

      return [...current, item];
    });

    setMentionSelectorType(null);
  }

  function handleMentionPlayerRemove(playerId: number) {
    setMentionedPlayers((current) =>
      current.filter((player) => player.id !== playerId)
    );
  }

  function handleMentionCoachRemove(coachId: string) {
    setMentionedCoaches((current) =>
      current.filter((coach) => coach.id !== coachId)
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8 xl:py-10">
      <div className="mb-8">
        <Link
          to="/"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-green-700 transition hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
        >
          <ArrowLeft size={17} />
          Voltar para o início
        </Link>

        <span className="mb-2 block text-sm font-bold uppercase tracking-wide text-green-700 dark:text-green-400">
          Brasileirão Série A — 2026
        </span>

        <h1 className="text-3xl font-extrabold text-green-950 dark:text-white">
          {category ? category.name : "Criar minha seleção"}
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Monte sua equipe escolhendo uma formação e preenchendo as posições.
        </p>

        <button
          type="button"
          onClick={handleSaveLineup}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-bold text-white shadow-lg transition hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500"
        >
          <Save size={19} />
          Salvar seleção
        </button>
      </div>

      {/* Escolha de categoria para quem entrou pelo botão principal. */}
      {!categoryFromUrl && (
        <section className="mb-8 rounded-2xl border border-green-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-lg font-bold text-green-950 dark:text-white">
            Escolha a categoria da sua seleção
          </h2>

          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Defina qual será o tema da sua escalação.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {categories.map((item) => {
              const isSelected = selectedCategoryId === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedCategoryId(item.id)}
                  className={`rounded-xl border p-4 text-left transition ${
                    isSelected
                      ? "border-green-500 bg-green-50 ring-2 ring-green-500/20 dark:bg-green-950/40"
                      : "border-gray-200 hover:border-green-400 hover:bg-green-50 dark:border-gray-700 dark:hover:bg-green-950/30"
                  }`}
                >
                  <span className="font-bold text-green-900 dark:text-white">
                    {item.name}
                  </span>

                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>

                  {isSelected && (
                    <span className="mt-3 block text-xs font-bold text-green-700 dark:text-green-400">
                      ✓ Categoria selecionada
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:gap-8 2xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <FormationSelector
            selectedFormation={selectedFormation}
            onFormationChange={handleFormationChange}
          />

          {/* Contador considera apenas as vagas da formação atual e o goleiro. */}
          <section className="rounded-2xl border border-green-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="font-bold text-green-950 dark:text-white">
              Sua escalação
            </h2>

            <p className="mt-2 text-2xl font-extrabold text-green-700 dark:text-green-400">
              {startingPlayers.length} / 11
            </p>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <div
                className="h-full rounded-full bg-green-600 transition-all"
                style={{
                  width: `${(startingPlayers.length / 11) * 100}%`,
                }}
              />
            </div>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {startingPlayers.length === 11
                ? "Escalação completa!"
                : `Faltam ${11 - startingPlayers.length} jogadores para completar os titulares.`}
            </p>
          </section>

          {/* Área temporária para preservar jogadores fora da formação atual. */}
          <section className="rounded-2xl border border-green-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="font-bold text-green-950 dark:text-white">
              Jogadores a reposicionar
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Jogadores que não ocupam uma vaga na formação atual ficam
              preservados aqui.
            </p>

            <div className="mt-4 space-y-2">
              {reservePlayers.length > 0 ? (
                reservePlayers.map((player) => (
                  <div
                    key={player.id}
                    className="rounded-xl border border-gray-200 p-3 text-sm dark:border-gray-700"
                  >
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {player.name}
                    </p>

                    <p className="text-gray-500 dark:text-gray-400">
                      {player.club}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-3 rounded-xl border border-dashed border-green-200 p-4 dark:border-gray-700">
                  <UserRound
                    size={22}
                    className="text-green-600 dark:text-green-400"
                  />

                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Nenhum jogador aguardando reposicionamento.
                  </span>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-green-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="font-bold text-green-950 dark:text-white">
              Treinador
            </h2>

            <button
              type="button"
              onClick={() => setIsCoachSelectorOpen(true)}
              className="mt-4 flex w-full items-center gap-3 rounded-xl border border-dashed border-green-200 p-4 text-left transition hover:border-green-500 hover:bg-green-50 dark:border-gray-700 dark:hover:bg-green-950/30"
            >
              <UserRound
                size={25}
                className="shrink-0 text-green-600 dark:text-green-400"
              />

              <div className="min-w-0 flex-1">
                {selectedCoach ? (
                  <>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {selectedCoach.name}
                    </p>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {selectedCoach.stints
                        .map((stint) => stint.club)
                        .join(" • ")}
                    </p>
                  </>
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Nenhum treinador selecionado. Clique para escolher.
                  </span>
                )}
              </div>

              <span className="shrink-0 text-sm font-semibold text-green-700 dark:text-green-400">
                {selectedCoach ? "Alterar" : "Selecionar"}
              </span>
            </button>
          </section>

          <section className="rounded-2xl border border-green-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4">
              <h2 className="font-bold text-green-950 dark:text-white">
                {mentionTitle}
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Jogadores e treinadores que merecem uma menção.
              </p>
            </div>

            {/* Menções de jogadores */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Jogadores
                </h3>

                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {mentionedPlayers.length}/10
                </span>
              </div>

              {mentionedPlayers.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-gray-200 p-3 dark:border-gray-700"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {player.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {player.club}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleMentionPlayerRemove(player.id)}
                    aria-label={`Remover ${player.name} das menções`}
                    className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                disabled={mentionedPlayers.length >= 10}
                onClick={() => setMentionSelectorType("player")}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-green-300 p-3 text-sm font-semibold text-green-700 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-green-400 dark:hover:bg-green-950/30"
              >
                <Plus size={17} />
                Adicionar jogador
              </button>
            </div>

            <div className="my-5 border-t border-gray-100 dark:border-gray-800" />

            {/* Menções de treinadores */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Treinadores
                </h3>

                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  {mentionedCoaches.length}/2
                </span>
              </div>

              {mentionedCoaches.map((coach) => (
                <div
                  key={coach.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-gray-200 p-3 dark:border-gray-700"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {coach.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {coach.stints.map((stint) => stint.club).join(" • ")}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleMentionCoachRemove(coach.id)}
                    aria-label={`Remover ${coach.name} das menções`}
                    className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                disabled={mentionedCoaches.length >= 2}
                onClick={() => setMentionSelectorType("coach")}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-green-300 p-3 text-sm font-semibold text-green-700 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-green-400 dark:hover:bg-green-950/30"
              >
                <Plus size={17} />
                Adicionar treinador
              </button>
            </div>
          </section>
        </aside>

        <section className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-green-950 dark:text-white">
              Campo de jogo
            </h2>

            <span className="rounded-lg bg-green-100 px-3 py-1.5 text-sm font-bold text-green-800 dark:bg-green-900 dark:text-green-100">
              {formation.name}
            </span>
          </div>

          <FootballPitch
            formation={formation}
            selectedPlayers={selectedPlayers}
            onSlotClick={setActiveSlotId}
          />
        </section>
      </div>

      {activeSlot && activeSlotId && (
        <PlayerSelector
          slot={activeSlot}
          players={players}
          selectedPlayerIds={selectedPlayerIds}
          onSelect={handlePlayerSelect}
          onRemove={
            selectedPlayers[activeSlotId] ? handlePlayerRemove : undefined
          }
          onClose={() => setActiveSlotId(null)}
        />
      )}

      {isCoachSelectorOpen && (
        <CoachSelector
          coaches={coaches}
          selectedCoachId={selectedCoach?.id}
          onSelect={handleCoachSelect}
          onRemove={selectedCoach ? handleCoachRemove : undefined}
          onClose={() => setIsCoachSelectorOpen(false)}
        />
      )}

      {mentionSelectorType === "player" && (
        <MentionSelector
          type="player"
          players={players}
          selectedIds={
            new Set([
              ...Object.values(selectedPlayers).map((player) => player.id),
              ...mentionedPlayers.map((player) => player.id),
            ])
          }
          onSelect={handleMentionPlayerSelect}
          onClose={() => setMentionSelectorType(null)}
        />
      )}

      {mentionSelectorType === "coach" && (
        <MentionSelector
          type="coach"
          coaches={coaches}
          selectedIds={
            new Set([
              ...(selectedCoach ? [selectedCoach.id] : []),
              ...mentionedCoaches.map((coach) => coach.id),
            ])
          }
          onSelect={handleMentionCoachSelect}
          onClose={() => setMentionSelectorType(null)}
        />
      )}
    </main>
  );
}