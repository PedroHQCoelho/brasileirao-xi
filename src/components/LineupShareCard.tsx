import { forwardRef } from "react";
import { UserRound } from "lucide-react";
import { GiSoccerBall } from "react-icons/gi";

import { categories } from "../data/categories";
import { formations, goalkeeperSlot } from "../data/formations";

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
function PlayerPortrait({
  player,
}: {
  player?: Player;
}) {
  if (!player) {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white/30 bg-white/10">
        <UserRound size={22} className="text-white/60" />
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
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-white bg-green-700 text-xs font-extrabold text-white shadow-lg">
        {initials}
      </div>

      {player.photo && (
        <img
          src={getShareableImageUrl(player.photo)}
          alt={player.name}
          loading="eager"
          decoding="sync"
          className="absolute inset-0 h-full w-full rounded-full border-2 border-white object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      )}

      {player.clubCrest && (
        <div className="absolute -bottom-1 -right-2 flex h-5 w-5 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-white shadow-md">
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

      <p className="mt-1 w-full truncate text-[10px] font-extrabold leading-tight text-white">
        {player?.name ?? "Aguardando"}
      </p>

      <p className="mt-0.5 text-[9px] font-bold uppercase leading-tight tracking-wide text-green-200">
        {slot.label}
      </p>

      {player && (
        <p className="mt-0.5 w-full truncate text-[8px] leading-tight text-white/65">
          {player.club}
        </p>
      )}
    </div>
  );
}

export const LineupShareCard = forwardRef<
  HTMLDivElement,
  LineupShareCardProps
>(function LineupShareCard({ lineup }, ref) {
  const category = categories.find(
    (item) => item.id === lineup.category
  );

  const formation = formations.find(
    (item) => item.id === lineup.formation
  );

  const goalkeeper = lineup.selectedPlayers.goalkeeper;

  const mentionedCount =
    (lineup.mentionedPlayers?.length ?? 0) +
    (lineup.mentionedCoaches?.length ?? 0);

  return (
    <div
      ref={ref}
      className="relative mx-auto flex aspect-4/5 w-full max-w-135 flex-col overflow-hidden rounded-[28px] bg-[#071B16] p-5 text-white sm:p-6"
      style={{
        background:
          "linear-gradient(145deg, #0b3025 0%, #071b16 55%, #051510 100%)",
      }}
    >
      {/* Elementos decorativos */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-green-500/10" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-green-400/10" />

      {/* Cabeçalho */}
      <header className="relative z-10 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-green-300">
              Brasileirão XI
            </p>
            <p className="mt-1 text-[9px] font-semibold uppercase tracking-widest text-white/50">
              Série A • {lineup.season}
            </p>
          </div>

          <span className="rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1.5 text-[10px] font-bold text-green-200">
            {category?.name ?? "Seleção"}
          </span>
        </div>

        <h2 className="mt-4 line-clamp-2 text-2xl font-black leading-tight tracking-tight">
          {lineup.name}
        </h2>

        <div className="mt-2 flex items-center gap-2">
          <span className="rounded-md bg-green-500 px-3 py-1 text-xs font-black text-green-950">
            {formation?.name ?? lineup.formation}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
            Minha escalação
          </span>
        </div>
      </header>

      {/* Campo */}
      <section
        className="relative z-10 mt-4 flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/25 px-2 py-3"
        style={{
          background:
            "linear-gradient(180deg, #247c4d 0%, #17613c 100%)",
        }}
      >
        {/* Linhas do gramado */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-1/2 border-t border-white/20" />
          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20" />
          <div className="absolute inset-x-12 top-0 h-10 border-b border-x border-white/15" />
          <div className="absolute inset-x-12 bottom-0 h-10 border-x border-t border-white/15" />
        </div>

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
            <p className="text-center text-sm text-white">
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
      </section>

      {/* Informações adicionais */}
      <footer className="relative z-10 mt-3 flex shrink-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-widest text-green-300">
            Treinador
          </p>
          <p className="mt-1 truncate text-xs font-bold text-white">
            {lineup.coach?.name ?? "Não selecionado"}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[9px] font-bold uppercase tracking-widest text-green-300">
            Menções
          </p>
          <p className="mt-1 text-xs font-bold text-white">
            {mentionedCount} nomes
          </p>
        </div>
      </footer>

      {/* Crédito de autoria centralizado no rodapé do cartão. */}
      <div className="relative z-10 mt-3 flex shrink-0 flex-col items-center">
        <div className="flex w-full items-center gap-3">
          <span className="h-px flex-1 bg-linear-to-r from-transparent via-green-400/70 to-green-400/20" />

          {/* Ícone vetorial próprio para manter a exportação independente de fontes e imagens externas. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4 shrink-0 text-green-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <GiSoccerBall size={26}/>
           </svg>

          <span className="h-px flex-1 bg-linear-to-l from-transparent via-green-400/70 to-green-400/20" />
        </div>

        <p className="mt-1.5 text-center text-[9px] font-semibold tracking-wide text-white/70">
          Desenvolvido por{" "}
          <span className="font-extrabold text-green-300">Pedro Coelho</span>
        </p>
      </div>
    </div>
  );
});

LineupShareCard.displayName = "LineupShareCard";
