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
  if (rightScoreRef.current === 10) {
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

function checkLoseConditionFour(
  canvas: HTMLCanvasElement | null,
  leftScoreRef: React.MutableRefObject<number>,
  rightScoreRef: React.MutableRefObject<number>,
  setGameAccepted: React.Dispatch<React.SetStateAction<boolean>>,
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>,
  setStartCountdown: React.Dispatch<React.SetStateAction<boolean>>,
  leftUserTop: User | undefined,
  leftUserBottom: User | undefined,
  rightUserTop: User | undefined,
  rightUserBottom: User | undefined,
  endGameFour: (data: {
    winner: string;
    winnerScore: number;
    loser: string;
    loserScore: number;
  }) => void,
  username: string
) {
  if (canvas === null) return;
  if (rightScoreRef.current === 10 || leftScoreRef.current === 10) {
    setGameAccepted(false);
    setGameStarted(false);
    setStartCountdown(false);

    if (rightScoreRef.current === 10) {
      if (username === leftUserTop?.username) {
        endGameFour({
          winner: rightUserTop?.id || "",
          winnerScore: rightScoreRef.current,
          loser: leftUserTop?.id || "",
          loserScore: leftScoreRef.current,
        });
      }
      if (
        username === rightUserTop?.username ||
        username === rightUserBottom?.username
      ) {
        toast.success("You have won the game");
      }
    }
    if (leftScoreRef.current === 10) {
      if (username === rightUserTop?.username) {
        endGameFour({
          winner: leftUserTop?.id || "",
          winnerScore: leftScoreRef.current,
          loser: rightUserTop?.id || "",
          loserScore: rightScoreRef.current,
        });
      }
      if (
        username === leftUserTop?.username ||
        username === leftUserBottom?.username
      ) {
        toast.error("You have lost the game");
      }
    }
  }
}

export { checkLoseConditionOnline, checkLoseConditionFour };
