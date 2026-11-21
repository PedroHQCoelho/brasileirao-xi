import { positions } from "../data/positions";
import type { Formation } from "../data/formations";

interface FootballPitchProps {
  formation: Formation;
}

export function FootballPitch({ formation }: FootballPitchProps) {
  /**
   * Converte o código interno da posição para sua abreviação em português.
   * Exemplo: LW -> PE, CB -> ZAG e ST -> ATA.
  */
  const getPositionAbbreviation = (code: string) => {
    const position = positions.find((item) => item.code === code);

    // Caso o código não seja encontrado, mantém o valor original.
    return position?.abbreviation ?? code;
  };
  return (
    <div className="rounded-2xl border border-green-200 bg-green-800 p-3 shadow-lg dark:border-green-900 dark:bg-green-950 sm:p-5">
      {/* Campo com marcações tradicionais de futebol */}
      <div className="relative overflow-hidden rounded-xl border-2 border-white/50 bg-green-700 dark:bg-green-900">
        {/* Linha central e círculo central do campo */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 border-t border-white/40" />

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40" />

        {/* Área de escalação: posições organizadas por setor */}
        <div className="relative z-10 flex min-h-155 flex-col justify-around gap-6 px-2 py-8 sm:px-6">
          {formation.lines.map((line, lineIndex) => (
            <div
              key={`${formation.id}-${lineIndex}`}
              className="flex items-center justify-center gap-2 sm:gap-6"
            >
              {line.map((position, playerIndex) => (
                <div
                  key={`${lineIndex}-${playerIndex}`}
                  className="flex min-w-0 flex-1 flex-col items-center gap-2"
                >
                  {/* Representa uma posição ainda sem jogador */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-white/80 bg-white/90 text-xs font-extrabold text-green-900 shadow-md sm:h-14 sm:w-14 sm:text-sm">
                    {getPositionAbbreviation(position)}
                  </div>

                  <span className="text-center text-[10px] font-medium text-white sm:text-xs">
                    Selecionar jogador
                  </span>
                </div>
              ))}
            </div>
          ))}

          {/* O goleiro permanece fixo, independentemente da formação */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-white bg-yellow-400 text-xs font-extrabold text-green-950 shadow-md sm:h-14 sm:w-14 sm:text-sm">
                GOL
              </div>

              <span className="text-xs font-medium text-white">
                Goleiro
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}