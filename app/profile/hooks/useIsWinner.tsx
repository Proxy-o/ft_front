import { Game } from "../types";

// Custom hook to check if a user is a winner
export default function useIsWinner() {
  return (game: Game, id: string) => {
    if (game.user1.id == game.winner?.id) {
      if (id == game.user1.id || id == game.user3?.id) return true;
      return false;
    }
    if (game.user2.id == game.winner?.id) {
      if (id == game.user2.id || id == game.user4?.id) return true;
      return false;
    }
  };
}
