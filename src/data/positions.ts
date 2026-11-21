/**
 * Códigos das posições reconhecidas pelo Brasileirão XI.
 * Cada jogador poderá atuar em uma ou mais dessas posições.
 */
export type PositionCode =
  | "GK"
  | "RB"
  | "CB"
  | "LB"
  | "RWB"
  | "LWB"
  | "DM"
  | "CM"
  | "AM"
  | "RW"
  | "LW"
  | "ST";

/**
 * Informações utilizadas para identificar cada posição
 * na interface e nas regras de compatibilidade.
 */
export interface Position {
  code: PositionCode;
  name: string;
  abbreviation: string;
  category: "goalkeeper" | "defender" | "midfielder" | "forward";
}

/**
 * Catálogo oficial de posições do Brasileirão XI.
 */
export const positions: Position[] = [
  {
    code: "GK",
    name: "Goleiro",
    abbreviation: "GOL",
    category: "goalkeeper",
  },
  {
    code: "RB",
    name: "Lateral-direito",
    abbreviation: "LD",
    category: "defender",
  },
  {
    code: "CB",
    name: "Zagueiro",
    abbreviation: "ZAG",
    category: "defender",
  },
  {
    code: "LB",
    name: "Lateral-esquerdo",
    abbreviation: "LE",
    category: "defender",
  },
    {
    code: "RWB",
    name: "Ala-direito",
    abbreviation: "AD",
    category: "midfielder",
  },
  {
    code: "LWB",
    name: "Ala-esquerdo",
    abbreviation: "AE",
    category: "midfielder",
  },
  {
    code: "DM",
    name: "Volante",
    abbreviation: "VOL",
    category: "midfielder",
  },
  {
    code: "CM",
    name: "Meia central",
    abbreviation: "MC",
    category: "midfielder",
  },
  {
    code: "AM",
    name: "Meia ofensivo",
    abbreviation: "MEI",
    category: "midfielder",
  },
  {
    code: "RW",
    name: "Ponta-direita",
    abbreviation: "PD",
    category: "forward",
  },
  {
    code: "LW",
    name: "Ponta-esquerda",
    abbreviation: "PE",
    category: "forward",
  },
  {
    code: "ST",
    name: "Atacante",
    abbreviation: "ATA",
    category: "forward",
  },
];