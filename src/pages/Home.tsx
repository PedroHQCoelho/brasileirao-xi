import { Link } from "react-router-dom";

import { PitchSurface } from "../components/FootballPitch";
import { categories } from "../data/categories";
import { categoryTone } from "../data/categoryTone";

// Vagas da prévia: as mesmas posições da formação 4-3-3.
const previewLines = [
  ["PE", "ATA", "PD"],
  ["MEI", "MEI", "MEI"],
  ["LE", "ZAG", "ZAG", "LD"],
];

function PreviewSlot({ label, goalkeeper = false }: { label: string; goalkeeper?: boolean }) {
  return (
    <div
      className={`display flex h-11 w-11 items-center justify-center rounded-full border-2 border-dashed text-base sm:h-14 sm:w-14 sm:text-xl ${
        goalkeeper
          ? "border-yellow-400 bg-yellow-400/20 text-yellow-300"
          : "border-chalk/80 bg-black/20 text-chalk"
      }`}
    >
      {label}
    </div>
  );
}

export function Home() {
  return (
    <main className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 sm:py-14">
      {/* Apresentação principal do projeto */}
      <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        {/* Texto de apresentação e botão de criação */}
        <div>
          {/* Temporada: tarja inclinada, como nas transmissões */}
          <span className="mb-5 inline-block -skew-x-12 bg-yellow-400 px-4 py-1">
            <span className="display inline-block skew-x-12 text-xl text-canary-ink">
              Série A 2026
            </span>
          </span>

          <h1 className="display max-w-2xl text-[52px] text-green-950 dark:text-white sm:text-7xl lg:text-[88px]">
            Monte sua seleção do Brasileirão.
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-600 dark:text-gray-300">
            Escolha os jogadores, defina a formação e monte sua seleção com os
            melhores, piores, surpresas e decepções da temporada.
          </p>

          {/* Atalho para iniciar a criação de uma seleção */}
          <Link
            to="/criar"
            className="display mt-9 inline-block rounded-md bg-yellow-400 px-8 py-3.5 text-2xl text-canary-ink transition hover:bg-yellow-300"
          >
            Criar minha seleção
          </Link>
        </div>

        {/* Prévia do campo */}
        <div className="mx-auto w-full max-w-xl lg:max-w-none">
          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-950 sm:p-4">
            <PitchSurface centerCircle="h-20 w-20 sm:h-28 sm:w-28">
              <span className="display absolute left-3 top-3 z-10 -skew-x-12 bg-yellow-400 px-3 py-0.5 text-lg text-canary-ink">
                <span className="inline-block skew-x-12">4-3-3</span>
              </span>

              <div className="relative z-10 flex min-h-[420px] flex-col justify-around gap-4 px-3 py-10 sm:min-h-[560px]">
                {previewLines.map((line, lineIndex) => (
                  <div key={lineIndex} className="flex items-center justify-around">
                    {line.map((label, index) => (
                      <PreviewSlot key={`${label}-${index}`} label={label} />
                    ))}
                  </div>
                ))}

                <div className="flex justify-center">
                  <PreviewSlot label="GOL" goalkeeper />
                </div>
              </div>
            </PitchSurface>
          </div>
        </div>
      </section>

      {/* Escolha da categoria da seleção */}
      <section className="mt-20 sm:mt-24">
        <h2 className="display text-4xl text-green-950 dark:text-white sm:text-5xl">
          Escolha sua categoria
        </h2>

        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Que tipo de seleção você quer montar?
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/criar?categoria=${category.id}`}
              className={`group relative flex min-h-44 flex-col justify-between overflow-hidden rounded-lg p-6 transition hover:-translate-y-1 sm:min-h-64 ${categoryTone[category.id]}`}
            >
              {/* Cartão do árbitro como marca d'água */}
              <span
                aria-hidden="true"
                className="absolute -right-3 -top-4 h-28 w-20 rotate-12 rounded-md bg-black/15 sm:h-36 sm:w-24"
              />

              <h3 className="display relative text-4xl sm:text-5xl">
                {category.name}
              </h3>

              <div className="relative">
                <p className="max-w-[18rem] text-base leading-snug opacity-90">
                  {category.description}
                </p>

                <span className="mt-4 inline-block border-b-2 border-current pb-0.5 text-sm font-bold">
                  Montar seleção
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
