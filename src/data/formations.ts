/**
 * Representa uma formação tática disponível no Brasileirão XI.
 * Cada linha contém as posições de um setor do campo.
 */
export interface Formation {
  id: string;
  name: string;
  lines: string[][];
}

/**
 * Formações disponíveis para montar uma escalação.
 * As linhas são organizadas do ataque em direção à defesa.
 */
export const formations: Formation[] = [
  {
    id: "4-3-3",
    name: "4-3-3",
    lines: [
      ["ATA", "ATA", "ATA"],
      ["MEI", "MEI", "MEI"],
      ["DEF", "DEF", "DEF", "DEF"],
    ],
  },
  {
    id: "4-4-2",
    name: "4-4-2",
    lines: [
      ["ATA", "ATA"],
      ["MEI", "MEI", "MEI", "MEI"],
      ["DEF", "DEF", "DEF", "DEF"],
    ],
  },
  {
    id: "4-2-3-1",
    name: "4-2-3-1",
    lines: [
      ["ATA"],
      ["MEI", "MEI", "MEI"],
      ["MEI", "MEI"],
      ["DEF", "DEF", "DEF", "DEF"],
    ],
  },
  {
    id: "3-5-2",
    name: "3-5-2",
    lines: [
      ["ATA", "ATA"],
      ["MEI", "MEI", "MEI", "MEI", "MEI"],
      ["DEF", "DEF", "DEF"],
    ],
  },
  {
    id: "4-1-4-1",
    name: "4-1-4-1",
    lines: [
      ["ATA"],
      ["MEI", "MEI", "MEI", "MEI"],
      ["MEI"],
      ["DEF", "DEF", "DEF", "DEF"],
    ],
  },
  {
    id: "3-4-3",
    name: "3-4-3",
    lines: [
      ["ATA", "ATA", "ATA"],
      ["MEI", "MEI", "MEI", "MEI"],
      ["DEF", "DEF", "DEF"],
    ],
  },
];