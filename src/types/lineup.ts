import type { Player } from "./player";

export interface Coach {
  id: number;
  name: string;
  photo?: string;
  teamId?: number;
  teamName?: string;
}

export type LineupCategory =
  | "best"
  | "worst"
  | "disappointments"
  | "surprises";

export interface Lineup {
  id: string;
  name: string;
  season: number;
  category: LineupCategory;
  formation: string;
  coach: Coach | null;
  players: (Player | null)[];
  createdAt: string;
}