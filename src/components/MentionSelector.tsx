import { useMemo, useState } from "react";
import { Search, X, ShieldCheck, UserRound } from "lucide-react";

import type { Player } from "../types/player";
import type { Coach } from "../types/coach";

interface MentionSelectorProps {
  type: "player" | "coach";
  players?: Player[];
  coaches?: Coach[];
  selectedIds: Set<number | string>;
  onSelect: (item: Player | Coach) => void;
  onClose: () => void;
}

export function MentionSelector({
  type,
  players = [],
  coaches = [],
  selectedIds,
  onSelect,
  onClose,
}: MentionSelectorProps) {
  const [search, setSearch] = useState("");

  const availableItems = useMemo(() => {
    const term = search.toLowerCase();

    if (type === "player") {
      return players.filter(
        (player) =>
          !selectedIds.has(player.id) &&
          (player.name.toLowerCase().includes(term) ||
            player.club.toLowerCase().includes(term))
      );
    }

    return coaches.filter(
      (coach) =>
        !selectedIds.has(coach.id) &&
        (coach.name.toLowerCase().includes(term) ||
          coach.stints.some((stint) =>
            stint.club.toLowerCase().includes(term)
          ))
    );
  }, [type, players, coaches, selectedIds, search]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Selecionar {type === "player" ? "jogador" : "treinador"}
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Pesquise pelo nome ou clube.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela"
            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={22} />
          </button>
        </header>

        <div className="p-5">
          <div className="relative mb-5">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Pesquisar ${type === "player" ? "jogador ou clube" : "treinador ou clube"}...`}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-600/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="max-h-96 space-y-2 overflow-y-auto">
            {availableItems.length > 0 ? (
              availableItems.map((item) => {
                const isPlayer = type === "player";
                const player = isPlayer ? (item as Player) : null;
                const coach = !isPlayer ? (item as Coach) : null;

                return (
                  <button
                    key={isPlayer ? player!.id : coach!.id}
                    type="button"
                    onClick={() => onSelect(item)}
                    className="flex w-full items-center gap-3 rounded-xl border border-gray-200 p-3 text-left transition hover:border-green-500 hover:bg-green-50 dark:border-gray-700 dark:hover:bg-green-950/40"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {isPlayer ? (
                        <ShieldCheck size={23} />
                      ) : (
                        <UserRound size={23} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {isPlayer ? player!.name : coach!.name}
                      </p>

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {isPlayer
                          ? player!.club
                          : coach!.stints.map((stint) => stint.club).join(" • ")}
                      </p>
                    </div>

                    <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                      Selecionar
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="py-10 text-center">
                <p className="font-semibold text-gray-700 dark:text-gray-200">
                  Nenhum resultado encontrado.
                </p>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Tente pesquisar por outro nome ou clube.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}