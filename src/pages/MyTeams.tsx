import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Shield,
  Trash2,
  Users,
  Trophy,
  Plus,
  Eye,
} from "lucide-react";

import { categories } from "../data/categories";
import { formations } from "../data/formations";

import { getLineups, deleteLineup } from "../services/lineupStorage";

import type { Lineup } from "../types/lineup";
import type { Player } from "../types/player";

import { LineupSharePreview } from "../components/LineupSharePreview";

// Formata a data de criação.
function formatDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Data não informada";
  }

  return parsedDate.toLocaleDateString("pt-BR");
}

// Identifica os jogadores titulares de acordo com a formação.
function getStartingPlayers(lineup: Lineup): Player[] {
  const formation = formations.find(
    (item) => item.id === lineup.formation
  );

  if (!formation) return [];

  const slotIds = [
    "goalkeeper",
    ...formation.lines.flatMap((line, lineIndex) =>
      line.map(
        (_, playerIndex) =>
          `${formation.id}-${lineIndex}-${playerIndex}`
      )
    ),
  ];

  return slotIds
    .map((slotId) => lineup.selectedPlayers[slotId])
    .filter((player): player is Player => Boolean(player));
}

export function MyTeams() {
  const [lineups, setLineups] = useState<Lineup[]>(() =>
    getLineups()
  );

  // Guarda a seleção que está aberta na pré-visualização do cartão.
  const [previewLineup, setPreviewLineup] = useState<Lineup | null>(null);

  // Exclui uma seleção salva.
  function handleDelete(id: string, name: string) {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir a seleção "${name}"?`
    );

    if (!confirmed) return;

    try {
      deleteLineup(id);
      setLineups(getLineups());
    } catch (error) {
      console.error("Erro ao excluir seleção:", error);
      alert("Não foi possível excluir esta seleção.");
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* Cabeçalho */}
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
          Minhas Seleções
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Gerencie suas escalações e relembre suas escolhas.
        </p>
      </div>

      {/* Resumo */}
      <section className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-green-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            <Trophy size={24} />
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Seleções criadas
            </p>

            <p className="text-2xl font-extrabold text-green-950 dark:text-white">
              {lineups.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-green-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            <Users size={24} />
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Jogadores selecionados
            </p>

            <p className="text-2xl font-extrabold text-green-950 dark:text-white">
              {lineups.reduce(
                (total, lineup) =>
                  total + getStartingPlayers(lineup).length,
                0
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Lista de seleções */}
      <section>
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-green-950 dark:text-white">
            Suas seleções
          </h2>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500"
          >
            <Plus size={17} />
            Nova seleção
          </Link>
        </div>

        {lineups.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-2">

            {lineups.map((lineup) => {
              const category = categories.find(
                (item) => item.id === lineup.category
              );

              const formation = formations.find(
                (item) => item.id === lineup.formation
              );

              const startingPlayers = getStartingPlayers(lineup);

              return (
                <article
                  key={lineup.id}
                  className="overflow-hidden rounded-2xl border border-green-100 bg-white shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                >
                  {/* Identificação */}
                  <div className="border-b border-gray-100 p-5 dark:border-gray-800">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span className="mb-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800 dark:bg-green-900 dark:text-green-200">
                          {category?.name ?? "Categoria não identificada"}
                        </span>

                        <h3 className="text-xl font-extrabold text-green-950 dark:text-white">
                          {lineup.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Temporada {lineup.season}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(lineup.id, lineup.name)
                        }
                        title="Excluir seleção"
                        aria-label={`Excluir ${lineup.name}`}
                        className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <Trash2 size={19} />
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <Shield size={16} />
                        {formation?.name ?? lineup.formation}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={16} />
                        {formatDate(lineup.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Titulares */}
                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="font-bold text-gray-800 dark:text-gray-200">
                        Titulares
                      </h4>

                      <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                        {startingPlayers.length}/11
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {startingPlayers.map((player) => (
                        <div
                          key={player.id}
                          className="min-w-0"
                        >
                          <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
                            {player.name}
                          </p>

                          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                            {player.club}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Treinador e menções */}
                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Treinador
                        </p>

                        <p className="mt-1 truncate text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {lineup.coach?.name ?? "Não selecionado"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Menções
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {(lineup.mentionedPlayers?.length ?? 0) +
                            (lineup.mentionedCoaches?.length ?? 0)}
                        </p>
                      </div>
                    </div>

                    {/* Abre a prévia sem alterar os dados salvos. */}
                    <div className="mt-5 border-t border-gray-100 pt-4 dark:border-gray-800">
                      <button
                        type="button"
                        onClick={() => setPreviewLineup(lineup)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-green-200 px-4 py-2.5 text-sm font-bold text-green-700 transition hover:bg-green-50 dark:border-green-900 dark:text-green-400 dark:hover:bg-green-950/40"
                      >
                        <Eye size={17} />
                        Visualizar cartão
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}

          </div>
        ) : (
          /* Estado vazio */
          <div className="rounded-2xl border border-dashed border-green-200 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              <Trophy size={30} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-green-950 dark:text-white">
              Você ainda não criou nenhuma seleção.
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500 dark:text-gray-400">
              Monte seu time ideal do Brasileirão e salve suas escolhas
              para encontrá-las aqui.
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-bold text-white transition hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-500"
            >
              <Plus size={18} />
              Criar minha seleção
            </Link>
          </div>
        )}
      </section>

      {previewLineup && (
        <LineupSharePreview
          lineup={previewLineup}
          onClose={() => setPreviewLineup(null)}
        />
      )}
    </main>
  );
}