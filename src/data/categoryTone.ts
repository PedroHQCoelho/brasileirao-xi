import type { LineupCategory } from "../types/lineup";

/**
 * Cada categoria tem a sua cor, como os cartões do árbitro.
 * Usado na página inicial, na montagem da seleção e no cartão de compartilhamento.
 */

// Fundo e cor do texto sobre ele (classes do Tailwind)
export const categoryTone: Record<LineupCategory, string> = {
  best: "bg-[#17884a] text-white",
  worst: "bg-[#d93027] text-white",
  disappointments: "bg-yellow-400 text-canary-ink",
  surprises: "bg-[#2f5fe8] text-white",
};

// Cor pura (para elementos que precisam de um valor, como o cartão exportado)
export const categoryColor: Record<LineupCategory, string> = {
  best: "#17884a",
  worst: "#d93027",
  disappointments: "#ffd21f",
  surprises: "#2f5fe8",
};
