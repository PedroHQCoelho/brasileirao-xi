
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

    return player
      ? player.name
          .split(" ")
          .map((part) => part[0])
          .slice(0, 2)
          .join("")
      : fallback;
  }

  function renderPlayerCrest(player?: Player) {
    if (!player?.clubCrest) return null;

    return (
      <div className="absolute -bottom-1 -right-1 z-20 flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white shadow-md sm:h-8 sm:w-8 xl:h-9 xl:w-9">
        <img
          src={player.clubCrest}
          alt={`Escudo do ${player.club}`}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-green-200 bg-green-800 p-3 shadow-lg dark:border-green-900 dark:bg-green-950 sm:p-5">
      <div className="relative overflow-hidden rounded-xl border-2 border-white/50 bg-green-700 dark:bg-green-900">
        {/* Linha central */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 border-t border-white/40" />

        {/* Círculo central */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 sm:h-32 sm:w-32" />

        {/* Distribuição dos jogadores */}
<div className="relative z-10 flex min-h-162.5 flex-col justify-around gap-6 px-2 py-8 sm:min-h-190 sm:px-6 sm:py-10 xl:min-h-235">
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
                    {/* Fotografia e escudo */}
                    <div className="relative h-14 w-14 shrink-0 sm:h-16 sm:w-16 xl:h-30 xl:w-30">
                      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-white/80 bg-white/90 text-xs font-extrabold text-green-900 shadow-md sm:text-sm">
                        {renderPlayerAvatar(player, position.label)}
                      </div>

                      {renderPlayerCrest(player)}
                    </div>

                    {/* Nome do jogador */}
                    <span className="max-w-full text-center text-[10px] font-semibold text-white sm:text-xs">
                      {player?.name ?? "Selecionar jogador"}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}

          {/* Goleiro: vaga fixa, independente da formação */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => onSlotClick("goalkeeper")}
              aria-label="Selecionar goleiro"
              className="flex flex-col items-center gap-2 rounded-lg p-1 transition hover:scale-105"
            >
              {/* Fotografia e escudo do goleiro */}
              <div className="relative h-14 w-14 shrink-0 sm:h-16 sm:w-16 xl:h-30 xl:w-30">
                <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-white bg-yellow-400 text-xs font-extrabold text-green-950 shadow-md sm:text-sm">
                  {renderPlayerAvatar(selectedPlayers.goalkeeper, "GOL")}
                </div>

                {renderPlayerCrest(selectedPlayers.goalkeeper)}
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