import { forwardRef } from "react";
import { UserRound } from "lucide-react";

import { categories } from "../data/categories";
import { categoryColor } from "../data/categoryTone";
import { formations, goalkeeperSlot } from "../data/formations";
import { CrestLogo } from "./CrestLogo";
import { PitchSurface } from "./FootballPitch";

import type { Lineup } from "../types/lineup";
import type { Player } from "../types/player";
import type { FormationSlot } from "../data/formations";

interface LineupShareCardProps {
  lineup: Lineup;
}

/**
 * Converte as URLs do provedor de imagens em URLs da própria aplicação.
 *
 * Em desenvolvimento, o Vite encaminha /football-images/* para o provedor.
 * Em produção, o rewrite de Netlify faz o mesmo trabalho.
 * Assim, o navegador e o html-to-image acessam imagens same-origin,
 * sem depender de permissões CORS do servidor externo.
 */
function getShareableImageUrl(source?: string): string | undefined {
  if (!source) return undefined;

  try {
    const imageUrl = new URL(source, window.location.origin);

    if (
      imageUrl.hostname === "football-api.yuvron.online" &&
      imageUrl.pathname.startsWith("/images/")
    ) {
      const imagePath = imageUrl.pathname.replace(/^\/images\//, "");
      return `/football-images/${imagePath}${imageUrl.search}`;
    }

    return source;
  } catch {
    return source;
  }
}

// Exibe a fotografia e o escudo do clube.
function PlayerPortrait({ player }: { player?: Player }) {
  if (!player) {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-chalk/60 bg-black/20">
        <UserRound size={22} className="text-chalk/60" />
      </div>
    );
  }

  const initials = player.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="relative h-12 w-12 shrink-0">
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-chalk bg-chalk text-xs font-extrabold text-green-900 shadow-lg">
        {initials}
      </div>

      {player.photo && (
        <img
          src={getShareableImageUrl(player.photo)}
          alt={player.name}
          loading="eager"
          decoding="sync"
          className="absolute inset-0 h-full w-full rounded-full border-2 border-chalk object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      )}

      {player.clubCrest && (
        <div className="absolute -bottom-1 -right-2 flex h-5 w-5 items-center justify-center overflow-hidden rounded-full border-2 border-chalk bg-chalk shadow-md">
          <img
            src={getShareableImageUrl(player.clubCrest)}
            alt={`Escudo do ${player.club}`}
            loading="eager"
            decoding="sync"
            className="h-full w-full object-contain"
            onError={(event) => {
              event.currentTarget.parentElement?.classList.add("hidden");
            }}
          />
        </div>
      )}
    </div>
  );
}

// Cartão compacto de um jogador no campo.
function PlayerCard({
  player,
  slot,
}: {
  player?: Player;
  slot: FormationSlot;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center text-center">
      <PlayerPortrait player={player} />

      <p className="mt-1.5 inline-block max-w-full truncate rounded bg-gray-950/75 px-1.5 py-0.5 text-[11px] font-bold leading-tight text-chalk">
        {player?.name ?? "Aguardando"}
      </p>

      <p className="mt-0.5 w-full truncate text-[9px] font-semibold leading-tight text-chalk/85">
        {player ? `${slot.label} · ${player.club}` : slot.label}
      </p>
    </div>
  );
}

export const LineupShareCard = forwardRef<
  HTMLDivElement,
  LineupShareCardProps
>(function LineupShareCard({ lineup }, ref) {
  const category = categories.find((item) => item.id === lineup.category);

  const formation = formations.find((item) => item.id === lineup.formation);

  const goalkeeper = lineup.selectedPlayers.goalkeeper;

  const mentionedCount =
    (lineup.mentionedPlayers?.length ?? 0) +
    (lineup.mentionedCoaches?.length ?? 0);

  const tone = category ? categoryColor[category.id] : "#ffd21f";

  return (
    <div
      ref={ref}
      className="relative mx-auto flex aspect-4/5 w-full max-w-135 flex-col overflow-hidden rounded-[28px] bg-gray-950 p-5 pt-7 text-chalk sm:p-6 sm:pt-8"
    >
      {/* Faixa na cor da categoria, como o cartão do árbitro */}
      <div
        className="absolute inset-x-0 top-0 h-2.5"
        style={{ backgroundColor: tone }}
      />

      {/* Cabeçalho */}
      <header className="relative z-10 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CrestLogo size={30} />

            <div>
              <p className="display text-xl leading-none">Brasileirão XI</p>
              <p className="mt-0.5 text-[10px] font-semibold text-chalk/60">
                Série A {lineup.season}
              </p>
            </div>
          </div>

          {/* Categoria: tarja inclinada na cor do cartão */}
          <span
            className="-skew-x-12 px-3 py-0.5"
            style={{
              backgroundColor: tone,
              color: category?.id === "disappointments" ? "#10190f" : "#ffffff",
            }}
          >
            <span className="display inline-block skew-x-12 text-xl">
              {category?.name ?? "Seleção"}
            </span>
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <h2 className="display line-clamp-2 text-[44px] leading-[0.92]">
            {lineup.name}
          </h2>

          <span className="mb-1 shrink-0 -skew-x-12 bg-yellow-400 px-3 py-0.5 text-canary-ink">
            <span className="display tabular inline-block skew-x-12 text-2xl">
              {formation?.name ?? lineup.formation}
            </span>
          </span>
        </div>
      </header>

      {/* Campo */}
      <PitchSurface
        centerCircle="h-20 w-20"
        className="mt-4 flex min-h-0 flex-1 flex-col px-2 py-3"
      >
        {/* Linhas e goleiro compartilham o espaço vertical do campo. */}
        <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-around gap-1">
          {formation ? (
            formation.lines.map((line, lineIndex) => (
              <div
                key={`${formation.id}-${lineIndex}`}
                className="flex items-center justify-around gap-1"
              >
                {line.map((slot, playerIndex) => {
                  const slotId = `${formation.id}-${lineIndex}-${playerIndex}`;

                  return (
                    <PlayerCard
                      key={slotId}
                      player={lineup.selectedPlayers[slotId]}
                      slot={slot}
                    />
                  );
                })}
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-chalk">
              Formação não encontrada.
            </p>
          )}

          {/* Goleiro dentro do fluxo do campo para não ser cortado. */}
          <div className="flex shrink-0 justify-center pt-1">
            <div className="flex w-24 flex-col items-center">
              <PlayerCard player={goalkeeper} slot={goalkeeperSlot} />
            </div>
          </div>
        </div>
      </PitchSurface>

      {/* Informações adicionais */}
      <footer className="relative z-10 mt-3 flex shrink-0 items-end justify-between gap-3 border-t border-chalk/15 pt-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-chalk/60">Treinador</p>
          <p className="truncate text-sm font-bold leading-tight">
            {lineup.coach?.name ?? "Não selecionado"}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[10px] font-semibold text-chalk/60">Menções</p>
          <p className="text-sm font-bold leading-tight">
            {mentionedCount} {mentionedCount === 1 ? "nome" : "nomes"}
          </p>
        </div>
      </footer>

      {/* Crédito de autoria */}
      <p className="relative z-10 mt-2.5 shrink-0 text-center text-[10px] font-semibold text-chalk/60">
        Desenvolvido por{" "}
        <span className="font-extrabold text-yellow-400">Pedro Coelho</span>
      </p>
    </div>
  );
});

LineupShareCard.displayName = "LineupShareCard";
