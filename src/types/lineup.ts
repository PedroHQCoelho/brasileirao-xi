import type { Player } from "./player";
import type { Coach } from "./coach";

// Mantém a categoria da seleção.
export type LineupCategory =
  | "best"
  | "worst"
  | "disappointments"
  | "surprises";

// Estrutura completa de uma seleção salva.
export interface Lineup {
  id: string;
  name: string;
  season: number;
  category: LineupCategory;
  formation: string;

  // Jogadores organizados por vaga, incluindo reservas.
  selectedPlayers: Record<string, Player>;

  // Treinador principal.
  coach: Coach | null;

  // Menções separadas dos titulares.
  mentionedPlayers: Player[];
  mentionedCoaches: Coach[];

  createdAt: string;
}

// Mantém a compatibilidade com possíveis imports antigos.
export type { Coach };