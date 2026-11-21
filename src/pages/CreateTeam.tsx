import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, UserRound } from "lucide-react";

import { categories } from "../data/categories";
import { formations } from "../data/formations";

import { FormationSelector } from "../components/FormationSelector";
import { FootballPitch } from "../components/FootballPitch";

export function CreateTeam() {
  // Recupera a categoria escolhida na página inicial.
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("categoria");

  // Localiza os dados da categoria selecionada.
  const category = categories.find((item) => item.id === categoryId);

  // Mantém a formação selecionada no estado da página.
  const [selectedFormation, setSelectedFormation] = useState("4-3-3");

  // Recupera os detalhes completos da formação atual.
  const formation = formations.find(
    (item) => item.id === selectedFormation
  ) ?? formations[0];

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      {/* Cabeçalho da página de criação */}
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

      {/* Área principal: configurações e campo */}
      <div className="grid items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <FormationSelector
            selectedFormation={selectedFormation}
            onFormationChange={setSelectedFormation}
          />

          {/* Espaço reservado para os jogadores que ainda não foram posicionados */}
          <section className="rounded-2xl border border-green-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="font-bold text-green-950 dark:text-white">
              Reservas e disponíveis
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Os jogadores selecionados que não estiverem na formação
              aparecerão nesta área.
            </p>

            <div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-green-200 p-4 dark:border-gray-700">
              <UserRound size={22} className="text-green-600 dark:text-green-400" />

              <span className="text-sm text-gray-500 dark:text-gray-400">
                Nenhum jogador selecionado.
              </span>
            </div>
          </section>

          {/* O treinador é escolhido independentemente dos jogadores */}
          <section className="rounded-2xl border border-green-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="font-bold text-green-950 dark:text-white">
              Treinador
            </h2>

            <div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-green-200 p-4 dark:border-gray-700">
              <UserRound size={22} className="text-green-600 dark:text-green-400" />

              <span className="text-sm text-gray-500 dark:text-gray-400">
                Nenhum treinador selecionado.
              </span>
            </div>
          </section>
        </aside>

        {/* Campo de futebol com a formação selecionada */}
        <section className="min-w-0">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-green-950 dark:text-white">
              Campo de jogo
            </h2>

            <span className="rounded-lg bg-green-100 px-3 py-1.5 text-sm font-bold text-green-800 dark:bg-green-900 dark:text-green-100">
              {formation.name}
            </span>
          </div>

          <FootballPitch formation={formation} />
        </section>
      </div>
    </main>
  );
}