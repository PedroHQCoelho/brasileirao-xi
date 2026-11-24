import type { Lineup } from "../types/lineup";

const STORAGE_KEY = "brasileirao-xi-lineups";

// Recupera todas as seleções salvas.
export function getLineups(): Lineup[] {
  try {
    const savedLineups = localStorage.getItem(STORAGE_KEY);

    if (!savedLineups) {
      return [];
    }

    const parsedLineups: unknown = JSON.parse(savedLineups);

    if (!Array.isArray(parsedLineups)) {
      return [];
    }

    return parsedLineups as Lineup[];
  } catch (error) {
    console.error("Erro ao recuperar seleções:", error);
    return [];
  }
}

// Salva uma nova seleção.
export function saveLineup(lineup: Lineup): void {
  const lineups = getLineups();

  const updatedLineups = [...lineups, lineup];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLineups));
}

// Atualiza uma seleção existente.
export function updateLineup(updatedLineup: Lineup): void {
  const lineups = getLineups();

  const updatedLineups = lineups.map((lineup) =>
    lineup.id === updatedLineup.id ? updatedLineup : lineup,
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLineups));
}

// Exclui uma seleção.
export function deleteLineup(id: string): void {
  const lineups = getLineups();

  const updatedLineups = lineups.filter((lineup) => lineup.id !== id);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLineups));
}