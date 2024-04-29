import { User } from "@/lib/types";
import { UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";

function enemyLeftGame(
  leftUser: User | undefined,
  rightUser: User | undefined,
  onGoingGame: UseQueryResult<{ game: any }, Error>,
  newBallPositionRef: React.MutableRefObject<{ x: number; y: number }>,
  handleSurrender: (
    leftUser: string,
    rightUser: string,
    game_id: string
  ) => void,
  canvas: HTMLCanvasElement | null,
  setGameAccepted: React.Dispatch<React.SetStateAction<boolean>>,
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>,
  setStartCountdown: React.Dispatch<React.SetStateAction<boolean>>,
  endGame: (data: {
    winner: string;
    winnerScore: number;
    loser: string;
    loserScore: number;
  }) => void
) {
  if (canvas === null) return;
  if (newBallPositionRef.current.x > canvas.width + 500) {
    handleSurrender(
      leftUser?.username || "",
      rightUser?.username || "",
      onGoingGame.data?.game?.id || ""
    );
    setGameAccepted(false);
    setGameStarted(false);
    setStartCountdown(false);
    endGame({
      winner: leftUser?.id || "",
      winnerScore: 10,
      loser: rightUser?.id || "",
      loserScore: 0,
    });
    toast.success("You have won the game");
  }
}

export default enemyLeftGame;
