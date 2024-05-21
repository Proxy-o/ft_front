import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation } from "@tanstack/react-query";

export default function useCreateTournamentGame() {
  async function createTournamentGame(player1: string, player2: string) {
    const res = await axiosInstance.post("game/create_tournament_game", {
      player1,
      player2,
    });
    const gameId = res.data.gameId;
    return gameId;
  }
  return {
    createTournamentGame,
  };
}
