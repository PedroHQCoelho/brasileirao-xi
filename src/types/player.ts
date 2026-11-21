import type { PositionCode } from "../data/positions";

/**
 * Representa um jogador disponível para as escalações.
 */
export interface Player {
  id: number;
  name: string;
  photo?: string;

  // Posições em que o jogador pode atuar.
  positions: PositionCode[];

  nationality?: string;
  age?: number;
  teamId?: number;
  teamName?: string;
}
