import { useMemo, useState } from "react";
import { Search, X, UserRound, Trash2 } from "lucide-react";

import type { Coach } from "../types/coach";

interface CoachSelectorProps {
  coaches: Coach[];
  selectedCoachId?: string;
  onSelect: (coach: Coach) => void;
  onRemove?: () => void;
  onClose: () => void;
}

// Formata uma data sem problemas de fuso horário.
function formatDate(date?: string) {
  if (!date) return null;

  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export function CoachSelector({
  coaches,
  selectedCoachId,
  onSelect,
  onRemove,
  onClose,
}: CoachSelectorProps) {
  const [search, setSearch] = useState("");

  const availableCoaches = useMemo(() => {
    const term = search.toLowerCase().trim();

    return coaches.filter((coach) => {
      const matchesName = coach.name.toLowerCase().includes(term);

      const matchesClub = coach.stints.some((stint) =>
        stint.club.toLowerCase().includes(term)
      );

      return matchesName || matchesClub;
    });
  }, [coaches, search]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="coach-selector-title"
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700">
          <div>
            <h2
              id="coach-selector-title"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              Selecionar treinador
            </h2>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Pesquise pelo treinador ou por um clube.
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
              placeholder="Pesquisar treinador ou clube..."
              className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-600/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 p-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950/30"
            >
              <Trash2 size={17} />
              Remover treinador selecionado
            </button>
          )}

          <div className="max-h-96 space-y-2 overflow-y-auto">
            {availableCoaches.length > 0 ? (
              availableCoaches.map((coach) => {
                const isSelected = coach.id === selectedCoachId;

                return (
                  <button
                    key={coach.id}
                    type="button"
                    onClick={() => onSelect(coach)}
                    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                      isSelected
                        ? "border-green-500 bg-green-50 dark:bg-green-950/40"
                        : "border-gray-200 hover:border-green-500 hover:bg-green-50 dark:border-gray-700 dark:hover:bg-green-950/40"
                    }`}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <UserRound size={23} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {coach.name}
                      </p>

                      <div className="mt-2 space-y-1">
                        {coach.stints.map((stint, index) => (
                          <p
                            key={`${coach.id}-${stint.club}-${index}`}
                            className="text-xs text-gray-500 dark:text-gray-400"
                          >
                            <span className="font-semibold">{stint.club}</span>

                            {" · "}

                            {formatDate(stint.startDate) ?? "Início não informado"}

                            {" — "}

                            {formatDate(stint.endDate) ?? "Atual"}

                            {stint.interim && " · Interino"}
                          </p>
                        ))}
                      </div>
                    </div>

                    <span className="shrink-0 text-sm font-semibold text-green-700 dark:text-green-400">
                      {isSelected ? "Selecionado" : "Selecionar"}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="py-10 text-center">
                <p className="font-semibold text-gray-700 dark:text-gray-200">
                  Nenhum treinador encontrado.
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