import type { PositionCode } from "../data/positions";

export interface Player {
  id: number;
  name: string;
  club: string;
  clubs?: string[];
  photo?: string;
  positions: PositionCode[];
  clubCrest?: string;
}


