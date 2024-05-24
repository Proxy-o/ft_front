import { User } from "@/lib/types";
import { UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";
import { canvasParamsFour } from "../types";

function checkLoseConditionOnline(
  canvas: HTMLCanvasElement | null,
  leftScoreRef: React.MutableRefObject<number>,
  rightScoreRef: React.MutableRefObject<number>,
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
  }) => void,
  gameStartedRef: React.MutableRefObject<boolean>
) {
  if (canvas === null) return;
  if (rightScoreRef.current === 3) {
    gameStartedRef.current = false;
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
  canvasParams: canvasParamsFour,
  canvas: HTMLCanvasElement | null,
  leftScoreRef: React.MutableRefObject<number>,
  rightScoreRef: React.MutableRefObject<number>,
  gameStartedRef: React.MutableRefObject<boolean>,
  endGameFour: (data: {
    winner: string;
    winnerScore: number;
    loser: string;
    loserScore: number;
  }) => void,
  username: string,
  handleRefetchPlayers: (
    user1: string,
    user2: string,
    user3: string,
    user4: string
  ) => void
) {
  if (canvas === null) return;
  const {
    userLeftTop: leftUserTop,
    userLeftBottom: leftUserBottom,
    userRightTop: rightUserTop,
    userRightBottom: rightUserBottom,
  } = canvasParams;
  if (rightScoreRef.current === 3 || leftScoreRef.current === 3) {
    handleRefetchPlayers(
      leftUserTop.current?.username || "",
      rightUserTop.current?.username || "",
      leftUserBottom.current?.username || "",
      rightUserBottom.current?.username || ""
    );
    gameStartedRef.current = false;
    if (rightScoreRef.current === 3) {
      if (username === leftUserTop.current?.username) {
        endGameFour({
          winner: rightUserTop.current?.id || "",
          winnerScore: rightScoreRef.current,
          loser: leftUserTop.current?.id || "",
          loserScore: leftScoreRef.current,
        });
      }
      if (
        username === rightUserTop.current?.username ||
        username === rightUserBottom.current?.username
      ) {
        toast.success("You have won the game");
      }
    }
    if (leftScoreRef.current === 3) {
      if (username === rightUserTop.current?.username) {
        endGameFour({
          winner: leftUserTop.current?.id || "",
          winnerScore: leftScoreRef.current,
          loser: rightUserTop.current?.id || "",
          loserScore: rightScoreRef.current,
        });
      }
      if (
        username === leftUserTop.current?.username ||
        username === leftUserBottom.current?.username
      ) {
        toast.error("You have lost the game");
      }
    }
  }
}

export { checkLoseConditionOnline, checkLoseConditionFour };
