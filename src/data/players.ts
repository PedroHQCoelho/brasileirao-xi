
import importedPlayers from "./players.full-import.json";
import type { Player } from "../types/player";
import type { PositionCode } from "./positions";

export const players: Player[] = importedPlayers.map((player) => ({
  id: player.id,
  name: player.name,
  club: player.club,
  clubs: player.clubs,
  photo: player.photo,
  positions: player.positions as PositionCode[],
  clubCrest: player.clubCrest,
}));
