
import { Link } from "react-router-dom";
import { ArrowRight, Plus, Trophy, Users } from "lucide-react";

import { categories } from "../data/categories";

export function Home() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-12">

      {/* Apresentação principal do projeto */}
      <section className="grid items-center gap-10 md:grid-cols-2">

        {/* Texto de apresentação e botão de criação */}
        <div>
        {/* Identificação da temporada do campeonato */}
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800 dark:bg-green-900 dark:text-green-100">
            <Trophy size={16} />
            Brasileirão Série A — 2026
          </span>

          <h1 className="max-w-xl text-4xl font-extrabold leading-tight text-green-950 dark:text-white md:text-5xl">
            Monte sua seleção do
            <span className="text-green-700 dark:text-green-400">
              {" "}Brasileirão.
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-lg leading-relaxed text-gray-600 dark:text-gray-300">
            Escolha os jogadores, defina a formação e monte sua seleção
            com os melhores, piores, surpresas e decepções da temporada.
          </p>

          {/* Atalho para iniciar a criação de uma seleção */}
          <Link
            to="/criar"
            className="mt-8 inline-flex items-center gap-3 rounded-xl bg-green-700 px-6 py-4 font-bold text-white shadow-lg shadow-green-900/15 transition hover:bg-green-800"
          >
            <Plus size={20} />
            Criar minha seleção
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Cartão ilustrativo que antecipa a futura tela de escalação */}
        <div className="relative overflow-hidden rounded-3xl bg-green-800 p-6 text-white shadow-xl dark:bg-green-950">

          {/* Elemento decorativo no canto superior direito */}
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-green-700 opacity-60" />

          <div className="relative">

            {/* Cabeçalho do cartão */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-200 dark:text-gray-300">
                  SUA ESCALAÇÃO
                </p>

                <h2 className="mt-1 text-2xl font-extrabold dark:text-white">
                  Brasileirão XI
                </h2>
              </div>

              <Trophy size={32} className="text-green-200" />
            </div>

            {/* Representação visual provisória do campo */}
            <div className="mt-8 rounded-2xl border-2 border-white/40 bg-green-700/70 p-5">

              <div className="flex flex-col gap-5">

                {/* Linha de ataque: três jogadores */}
                <div className="grid grid-cols-3 gap-5">
                  {["ATA", "ATA", "ATA"].map((position, index) => (
                    <div
                      key={`ata-${index}`}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-green-100 text-xs font-extrabold text-green-900">
                        {position}
                      </div>

                      <span className="text-xs text-green-100">
                        Jogador
                      </span>
                    </div>
                  ))}
                </div>

                {/* Linha do meio-campo: três jogadores */}
                <div className="grid grid-cols-3 gap-5">
                  {["MEI", "MEI", "MEI"].map((position, index) => (
                    <div
                      key={`mei-${index}`}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-green-100 text-xs font-extrabold text-green-900">
                        {position}
                      </div>

                      <span className="text-xs text-green-100">
                        Jogador
                      </span>
                    </div>
                  ))}
                </div>

                {/* Linha de defesa: quatro jogadores na mesma linha */}
                <div className="grid grid-cols-4 gap-2">
                  {["DEF", "DEF", "DEF", "DEF"].map((position, index) => (
                    <div
                      key={`def-${index}`}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-green-100 text-xs font-extrabold text-green-900">
                        {position}
                      </div>

                      <span className="text-xs text-green-100">
                        Jogador
                      </span>
                    </div>
                  ))}
                </div>

                {/* Goleiro: permanece centralizado na parte inferior */}
                <div className="mt-1 flex justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-yellow-400 text-xs font-extrabold text-green-950">
                      GOL
                    </div>

                    <span className="text-xs text-green-100">
                      Goleiro
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Mensagem de encerramento do cartão */}
            <p className="mt-4 text-center text-sm text-green-200 dark:text-gray-300">
              Sua escalação começa aqui!
            </p>

          </div>
        </div>
      </section>

      {/* Categorias disponíveis para criação de seleções */}
      <section className="mt-20">

        {/* Título e descrição da seção */}
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-green-950 dark:text-white">
            Escolha sua categoria
          </h2>

          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Que tipo de seleção você quer montar?
          </p>
        </div>

        {/* Cartões das quatro categorias */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/criar?categoria=${category.id}`}
              className="group rounded-2xl border border-green-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-green-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
            >

              {/* Ícone ilustrativo da categoria */}
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700 transition group-hover:bg-green-700 group-hover:text-white dark:bg-green-950 dark:text-green-400">
                <Users size={24} />
              </div>

              {/* Nome da categoria */}
              <h3 className="text-lg font-bold text-green-950 dark:text-white">
                {category.name}
              </h3>

              {/* Descrição da categoria */}
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {category.description}
              </p>

              {/* Link visual para iniciar a montagem */}
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-green-700">
                Montar seleção
                <ArrowRight size={16} />
              </span>

            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}