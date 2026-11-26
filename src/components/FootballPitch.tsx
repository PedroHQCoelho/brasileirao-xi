import type { ReactNode } from "react";

import type { Formation } from "../data/formations";
import type { Player } from "../types/player";

/**
 * Marcações do campo (áreas, meias-luas, círculo central e escanteios).
 * As medidas usam porcentagem do campo, então acompanham qualquer tamanho.
 */
export function PitchMarkings({
  centerCircle = "h-28 w-28 sm:h-32 sm:w-32",
}: {
  centerCircle?: string;
}) {
  const line = "border-chalk/40";

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* Linha central, círculo central e marca do meio */}
      <div className={`absolute inset-x-0 top-1/2 border-t-2 ${line}`} />
      <div
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 ${line} ${centerCircle}`}
      />
      <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-chalk/70" />

      {/* Grande área e pequena área (em cima e embaixo) */}
      <div className={`absolute left-1/2 top-0 h-[17%] w-[58%] -translate-x-1/2 border-2 border-t-0 ${line}`} />
      <div className={`absolute left-1/2 top-0 h-[7%] w-[26%] -translate-x-1/2 border-2 border-t-0 ${line}`} />
      <div className={`absolute bottom-0 left-1/2 h-[17%] w-[58%] -translate-x-1/2 border-2 border-b-0 ${line}`} />
      <div className={`absolute bottom-0 left-1/2 h-[7%] w-[26%] -translate-x-1/2 border-2 border-b-0 ${line}`} />

      {/* Marcas dos pênaltis */}
      <div className="absolute left-1/2 top-[12%] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-chalk/70" />
      <div className="absolute bottom-[12%] left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-chalk/70" />

      {/* Meias-luas: só a parte que fica fora da grande área */}
      <div className="absolute inset-0" style={{ clipPath: "inset(17% 0 0 0)" }}>
        <div className={`absolute left-1/2 top-[12%] aspect-square w-[24%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 ${line}`} />
      </div>
      <div className="absolute inset-0" style={{ clipPath: "inset(0 0 17% 0)" }}>
        <div className={`absolute bottom-[12%] left-1/2 aspect-square w-[24%] -translate-x-1/2 translate-y-1/2 rounded-full border-2 ${line}`} />
      </div>

      {/* Escanteios */}
      <div className={`absolute -left-3 -top-3 h-6 w-6 rounded-full border-2 ${line}`} />
      <div className={`absolute -right-3 -top-3 h-6 w-6 rounded-full border-2 ${line}`} />
      <div className={`absolute -bottom-3 -left-3 h-6 w-6 rounded-full border-2 ${line}`} />
      <div className={`absolute -bottom-3 -right-3 h-6 w-6 rounded-full border-2 ${line}`} />
    </div>
  );
}

/**
 * Gramado com faixas de corte, marcações, luz e sombra nas bordas.
 * Usado no campo da montagem e na prévia da página inicial.
 */
export function PitchSurface({
  children,
  className = "",
  centerCircle,
}: {
  children?: ReactNode;
  className?: string;
  centerCircle?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg border-2 border-chalk/70 ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(to bottom, var(--pitch-a) 50%, var(--pitch-b) 50%)",
        backgroundSize: "100% 20%",
        boxShadow: "inset 0 0 90px rgba(0,0,0,0.28)",
      }}
    >
      {/* Luz de refletor no centro do campo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(255,255,255,0.10), transparent 62%)",
        }}
      />

      <PitchMarkings centerCircle={centerCircle} />

      {children}
    </div>
  );
}

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
      <div className="absolute -bottom-1 -right-1 z-20 flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border-2 border-chalk bg-chalk shadow-md sm:h-8 sm:w-8 xl:h-9 xl:w-9">
        <img
          src={player.clubCrest}
          alt={`Escudo do ${player.club}`}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  // Vaga vazia: contorno tracejado de giz. Vaga preenchida: círculo cheio.
  const slotCircle = (filled: boolean, goalkeeper = false) =>
    `display flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 text-lg transition-colors sm:text-xl xl:text-4xl ${
      filled
        ? goalkeeper
          ? "border-yellow-300 bg-yellow-400 text-canary-ink shadow-[0_6px_16px_rgba(0,0,0,0.35)]"
          : "border-chalk bg-chalk text-green-900 shadow-[0_6px_16px_rgba(0,0,0,0.35)]"
        : goalkeeper
          ? "border-dashed border-yellow-400 bg-yellow-400/15 text-yellow-300 group-hover:bg-yellow-400/30"
          : "border-dashed border-chalk/80 bg-black/20 text-chalk group-hover:bg-white/20"
    }`;

  const nameLabel = (name: string | undefined, fallback: string, extra = "") =>
    name ? (
      <span
        className={`max-w-full rounded bg-gray-950/75 px-1.5 py-0.5 text-center text-[10px] font-semibold leading-tight text-chalk sm:text-xs xl:text-sm ${extra}`}
      >
        {name}
      </span>
    ) : (
      <span
        className={`max-w-full text-center text-[10px] font-semibold leading-tight text-chalk/85 [text-shadow:0_1px_3px_rgba(0,0,0,0.7)] sm:text-xs xl:text-sm ${extra}`}
      >
        {fallback}
      </span>
    );

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-950 p-3 shadow-lg sm:p-5">
      <PitchSurface>
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
                    className="group flex min-w-0 flex-1 flex-col items-center gap-2 rounded-lg p-1 transition hover:scale-105"
                  >
                    {/* Fotografia e escudo */}
                    <div className="relative h-14 w-14 shrink-0 sm:h-16 sm:w-16 xl:h-30 xl:w-30">
                      <div className={slotCircle(Boolean(player))}>
                        {renderPlayerAvatar(player, position.label)}
                      </div>

                      {renderPlayerCrest(player)}
                    </div>

                    {/* Nome do jogador */}
                    {nameLabel(player?.name, "Selecionar jogador")}
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
              className="group flex flex-col items-center gap-2 rounded-lg p-1 transition hover:scale-105"
            >
              {/* Fotografia e escudo do goleiro */}
              <div className="relative h-14 w-14 shrink-0 sm:h-16 sm:w-16 xl:h-30 xl:w-30">
                <div className={slotCircle(Boolean(selectedPlayers.goalkeeper), true)}>
                  {renderPlayerAvatar(selectedPlayers.goalkeeper, "GOL")}
                </div>

                {renderPlayerCrest(selectedPlayers.goalkeeper)}
              </div>

              {nameLabel(selectedPlayers.goalkeeper?.name, "Goleiro", "max-w-32")}
            </button>
          </div>
        </div>
      </PitchSurface>
    </div>
  );
}
