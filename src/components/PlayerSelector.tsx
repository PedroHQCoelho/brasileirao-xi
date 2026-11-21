import { useMemo, useState } from "react";
import { Search, X, ShieldCheck, Trash2 } from "lucide-react";

import type { Player } from "../types/player";
import type { FormationSlot } from "../data/formations";

interface PlayerSelectorProps {
  slot: FormationSlot;
  players: Player[];
  selectedPlayerIds: Set<number>;
  onSelect: (player: Player) => void;
  onRemove?: () => void;
  onClose: () => void;
}

export function PlayerSelector({
  slot,
  players,
  selectedPlayerIds,
  onSelect,
  onRemove,
  onClose,
}: PlayerSelectorProps) {
  const [search, setSearch] = useState("");

  const availablePlayers = useMemo(() => {
    return players.filter((player) => {
      const compatible = player.positions.some((position) =>
        slot.acceptedPositions.includes(position)
      );

      const matchesSearch =
        player.name.toLowerCase().includes(search.toLowerCase()) ||
        player.club.toLowerCase().includes(search.toLowerCase());

      return compatible && !selectedPlayerIds.has(player.id) && matchesSearch;
    });
  }, [players, slot, selectedPlayerIds, search]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="player-selector-title"
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700">
          <div>
            <h2
              id="player-selector-title"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              Selecionar jogador
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Posição: {slot.label}
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
              placeholder="Pesquisar jogador ou clube..."
              className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-600/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Permite liberar a vaga sem precisar selecionar outro jogador. */}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 p-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
            >
              <Trash2 size={17} />
              Remover jogador desta posição
            </button>
          )}

          <div className="max-h-96 space-y-2 overflow-y-auto">
            {availablePlayers.length > 0 ? (
              availablePlayers.map((player) => (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => onSelect(player)}
                  className="flex w-full items-center gap-3 rounded-xl border border-gray-200 p-3 text-left transition hover:border-green-500 hover:bg-green-50 dark:border-gray-700 dark:hover:bg-green-950/40"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <ShieldCheck size={23} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-900 dark:text-white">
                      {player.name}
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {player.club}
                    </p>

                    <p className="mt-1 text-xs text-green-700 dark:text-green-400">
                      {player.positions.join(" • ")}
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                    Selecionar
                  </span>
                </button>
              ))
            ) : (
              <div className="py-10 text-center">
                <p className="font-semibold text-gray-700 dark:text-gray-200">
                  Nenhum jogador encontrado.
                </p>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Tente outra pesquisa ou escolha uma posição diferente.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}