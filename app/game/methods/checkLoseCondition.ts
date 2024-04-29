import { User } from "@/lib/types";
import { UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";

function checkLoseConditionOnline(
  canvas: HTMLCanvasElement | null,
  leftScoreRef: React.MutableRefObject<number>,
  rightScoreRef: React.MutableRefObject<number>,
  setGameAccepted: React.Dispatch<React.SetStateAction<boolean>>,
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>,
  setStartCountdown: React.Dispatch<React.SetStateAction<boolean>>,
  leftUser: User | undefined,
  rightUser: User | undefined,
  onGoingGame: UseQueryResult<{ game: any }, Error>,
  handleSurrender: (
    leftUser: string,
    rightUser: string,
    game_id: string
  ) => void,
  endGame: (data: {
    winner: string;
    winnerScore: number;
    loser: string;
    loserScore: number;
  }) => void
) {
  if (canvas === null) return;
  if (rightScoreRef.current === 3) {
    setGameAccepted(false);
    setGameStarted(false);
    setStartCountdown(false);
    endGame({
      winner: leftUser?.id || "",
      winnerScore: leftScoreRef.current,
      loser: rightUser?.id || "",
      loserScore: rightScoreRef.current,
    });
    handleSurrender(
      leftUser?.username || "",
      rightUser?.username || "",
      onGoingGame.data?.game?.id || ""
    );
    toast.error("You have lost the game");
  }
}

export default checkLoseConditionOnline;
