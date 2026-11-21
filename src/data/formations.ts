import type { PositionCode } from "./positions";

/**
 * Cada espaço da formação possui uma posição visual
 * e uma lista de posições aceitas pelo sistema.
 */
export interface FormationSlot {
  label: string;
  acceptedPositions: PositionCode[];
}

/**
 * Representa uma formação tática.
 */
export interface Formation {
  id: string;
  name: string;
  lines: FormationSlot[][];
}

const slot = (
  label: string,
  ...acceptedPositions: PositionCode[]
): FormationSlot => ({
  label,
  acceptedPositions,
});

/**
 * Vaga fixa do goleiro.
 * Ela é independente da formação escolhida e completa os 11 titulares.
 */
export const goalkeeperSlot: FormationSlot = slot("GOL", "GK");

/**
 * Formações disponíveis no Brasileirão XI.
 */
export const formations: Formation[] = [
  {
    id: "4-3-3",
    name: "4-3-3",
    lines: [
      [
        slot("PE", "LW"),
        slot("ATA", "ST"),
        slot("PD", "RW"),
      ],
      [
        slot("MEI", "DM", "CM", "AM"),
        slot("MEI", "DM", "CM", "AM"),
        slot("MEI", "DM", "CM", "AM"),
      ],
      [
        slot("LE", "LB"),
        slot("ZAG", "CB"),
        slot("ZAG", "CB"),
        slot("LD", "RB"),
      ],
    ],
  },
  {
    id: "4-4-2",
    name: "4-4-2",
    lines: [
      [
        slot("ATA", "ST"),
        slot("ATA", "ST"),
      ],
      [
        slot("MEI", "DM", "CM", "AM"),
        slot("MEI", "DM", "CM", "AM"),
        slot("MEI", "DM", "CM", "AM"),
        slot("MEI", "DM", "CM", "AM"),
      ],
      [
        slot("LE", "LB"),
        slot("ZAG", "CB"),
        slot("ZAG", "CB"),
        slot("LD", "RB"),
      ],
    ],
  },
  {
    id: "4-2-3-1",
    name: "4-2-3-1",
    lines: [
      [slot("ATA", "ST")],
      [
        slot("PE", "LW"),
        slot("MEI", "AM", "CM"),
        slot("PD", "RW"),
      ],
      [
        slot("VOL", "DM", "CM"),
        slot("VOL", "DM", "CM"),
      ],
      [
        slot("LE", "LB"),
        slot("ZAG", "CB"),
        slot("ZAG", "CB"),
        slot("LD", "RB"),
      ],
    ],
  },
  {
    id: "3-5-2",
    name: "3-5-2",
    lines: [
      [
        slot("ATA", "ST"),
        slot("ATA", "ST"),
      ],
      [
        slot("AE", "LWB"),
        slot("MEI", "DM", "CM", "AM"),
        slot("VOL", "DM", "CM"),
        slot("MEI", "DM", "CM", "AM"),
        slot("AD", "RWB"),
      ],
      [
        slot("ZAG", "CB"),
        slot("ZAG", "CB"),
        slot("ZAG", "CB"),
      ],
    ],
  },
  {
    id: "4-1-4-1",
    name: "4-1-4-1",
    lines: [
      [slot("ATA", "ST")],
      [
        slot("PE", "LW"),
        slot("MEI", "CM", "AM"),
        slot("MEI", "CM", "AM"),
        slot("PD", "RW"),
      ],
      [slot("VOL", "DM", "CM")],
      [
        slot("LE", "LB"),
        slot("ZAG", "CB"),
        slot("ZAG", "CB"),
        slot("LD", "RB"),
      ],
    ],
  },
  {
    id: "3-4-3",
    name: "3-4-3",
    lines: [
      [
        slot("PE", "LW"),
        slot("ATA", "ST"),
        slot("PD", "RW"),
      ],
      [
        slot("AE", "LWB"),
        slot("MEI", "DM", "CM", "AM"),
        slot("MEI", "DM", "CM", "AM"),
        slot("AD", "RWB"),
      ],
      [
        slot("ZAG", "CB"),
        slot("ZAG", "CB"),
        slot("ZAG", "CB"),
      ],
    ],
  },
];