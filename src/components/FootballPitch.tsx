import type { Formation } from "../data/formations";
import type { Player } from "../types/player";

interface FootballPitchProps {
  formation: Formation;
  selectedPlayers: Record<string, Player>;
  onSlotClick: (slotId: string) => void;
}

export function FootballPitch({
  formation,
  selectedPlayers,
  onSlotClick,
}: FootballPitchProps) {
  // Renderiza a imagem ou as iniciais do jogador.
  function renderPlayerAvatar(player?: Player, fallback = "Selecionar") {
    if (player?.photo) {
      return (
        <img
          src={player.photo}
          alt={player.name}
          className="h-full w-full object-cover"
        />
      );
    }

    return (
      player?.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("") ?? fallback
    );
  }

  return (
    <div className="rounded-2xl border border-green-200 bg-green-800 p-3 shadow-lg dark:border-green-900 dark:bg-green-950 sm:p-5">
      <div className="relative overflow-hidden rounded-xl border-2 border-white/50 bg-green-700 dark:bg-green-900">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 border-t border-white/40" />

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40" />

        <div className="relative z-10 flex min-h-155 flex-col justify-around gap-6 px-2 py-8 sm:px-6">
          {formation.lines.map((line, lineIndex) => (
            <div
              key={`${formation.id}-${lineIndex}`}
              className="flex items-center justify-center gap-2 sm:gap-6"
            >
              {line.map((position, playerIndex) => {
                const slotId = `${formation.id}-${lineIndex}-${playerIndex}`;
                const player = selectedPlayers[slotId];

                return (
                  <button
                    key={slotId}
                    type="button"
                    onClick={() => onSlotClick(slotId)}
                    aria-label={`Selecionar jogador para ${position.label}`}
                    className="flex min-w-0 flex-1 flex-col items-center gap-2 rounded-lg p-1 transition hover:scale-105"
                  >
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-white/80 bg-white/90 text-xs font-extrabold text-green-900 shadow-md sm:h-14 sm:w-14 sm:text-sm">
                      {renderPlayerAvatar(player, position.label)}
                    </div>

                    <span className="max-w-full text-center text-[10px] font-semibold text-white sm:text-xs">
                      {player?.name ?? "Selecionar jogador"}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}

          {/* Goleiro: vaga fixa, independente da formação. */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => onSlotClick("goalkeeper")}
              aria-label="Selecionar goleiro"
              className="flex flex-col items-center gap-2 rounded-lg p-1 transition hover:scale-105"
            >
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-white bg-yellow-400 text-xs font-extrabold text-green-950 shadow-md sm:h-14 sm:w-14 sm:text-sm">
                {renderPlayerAvatar(
                  selectedPlayers.goalkeeper,
                  "GOL"
                )}
              </div>

              <span className="max-w-32 text-center text-xs font-semibold text-white">
                {selectedPlayers.goalkeeper?.name ?? "Goleiro"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}