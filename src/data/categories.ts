import type { LineupCategory } from "../types/lineup";

export interface Category {
  id: LineupCategory;
  name: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: "best",
    name: "Os Melhores",
    description: "Os destaques positivos do Brasileirão.",
  },
  {
    id: "worst",
    name: "Os Piores",
    description: "Os jogadores com desempenho mais decepcionante.",
  },
  {
    id: "disappointments",
    name: "Decepções",
    description: "Quem ficou abaixo das expectativas.",
  },
  {
    id: "surprises",
    name: "Surpresas",
    description: "Quem surpreendeu positivamente.",
  },
];