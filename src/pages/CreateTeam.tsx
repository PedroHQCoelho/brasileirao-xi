import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, UserRound } from "lucide-react";

import { categories } from "../data/categories";
import { formations, goalkeeperSlot } from "../data/formations";
import { players } from "../data/player";
import { coaches } from "../data/coaches";

import type { Player } from "../types/player";
import type { Coach } from "../types/coach";
import type { Formation, FormationSlot } from "../data/formations";

import { FormationSelector } from "../components/FormationSelector";
import { FootballPitch } from "../components/FootballPitch";
import { PlayerSelector } from "../components/PlayerSelector";
import { CoachSelector } from "../components/CoachSelector";


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
  const categoryId = searchParams.get("categoria");
  const category = categories.find((item) => item.id === categoryId);

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
  const selectedPlayerIds = new Set(
  Object.entries(selectedPlayers)
    .filter(
      ([slotId]) =>
        activeSlotIds.has(slotId) && slotId !== activeSlotId
    )
    .map(([, player]) => player.id)
  );

  // Jogadores de formações anteriores ficam preservados temporariamente.
  const reservePlayers = Object.entries(selectedPlayers)
    .filter(([slotId]) => !activeSlotIds.has(slotId))
    .map(([, player]) => player);

  const startingPlayers = Object.entries(selectedPlayers)
    .filter(([slotId]) => activeSlotIds.has(slotId));

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

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
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
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
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
                      {selectedCoach.stints.map((stint) => stint.club).join(" • ")}
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
            selectedPlayers[activeSlotId]
              ? handlePlayerRemove
              : undefined
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
    </main>
  );
}