import type { PositionCode } from "./positions";

/**
 * Representa uma formação tática disponível no Brasileirão XI.
 * Cada linha contém posições específicas, organizadas do ataque à defesa.
 */
export interface Formation {
  id: string;
  name: string;
  lines: PositionCode[][];
}

/**
 * Formações disponíveis para montar uma escalação.
 * O goleiro é tratado separadamente e permanece fixo no campo.
 */
export const formations: Formation[] = [
  {
    id: "4-3-3",
    name: "4-3-3",
    lines: [
      ["LW", "ST", "RW"],
      ["CM", "CM", "CM"],
      ["LB", "CB", "CB", "RB"],
    ],
  },
  {
    id: "4-4-2",
    name: "4-4-2",
    lines: [
      ["ST", "ST"],
      ["LW", "CM", "CM", "RW"],
      ["LB", "CB", "CB", "RB"],
    ],
  },
  {
    id: "4-2-3-1",
    name: "4-2-3-1",
    lines: [
      ["ST"],
      ["LW", "AM", "RW"],
      ["DM", "DM"],
      ["LB", "CB", "CB", "RB"],
    ],
  },
  {
    id: "3-5-2",
    name: "3-5-2",
    lines: [
      ["ST", "ST"],
      ["LWB", "CM", "DM", "CM", "RWB"],
      ["CB", "CB", "CB"],
    ],
  },
  {
    id: "4-1-4-1",
    name: "4-1-4-1",
    lines: [
      ["ST"],
      ["LW", "CM", "CM", "RW"],
      ["DM"],
      ["LB", "CB", "CB", "RB"],
    ],
  },
  {
    id: "3-4-3",
    name: "3-4-3",
    lines: [
      ["LW", "ST", "RW"],
      ["LWB", "CM", "CM", "RWB"],
      ["CB", "CB", "CB"],
    ],
  },
];