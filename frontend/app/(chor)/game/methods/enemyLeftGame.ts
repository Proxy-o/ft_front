import { toast } from "sonner";
import { canvasParams, canvasParamsFour } from "../types";

function enemyLeftGame(
  canvasParams: canvasParams,
  time: React.MutableRefObject<number>,
  enemyLeftGameRef: React.MutableRefObject<boolean>,
  gameStartedRef: React.MutableRefObject<boolean>,
  handleTime: (time: number, enemy: string) => void,
  endGame: (data: {
    winner: string;
    winnerScore: number;
    loser: string;
    loserScore: number;
  }) => void
) {
  const { canvas, leftUserRef, rightUserRef } = canvasParams;
  if (canvas === null) return;
  const currnetTime = new Date().getTime();
  const seconds = Math.floor(currnetTime / 1000);
  if (
    (!enemyLeftGameRef.current &&
      seconds % 2 === 0 &&
      seconds !== time.current) ||
    time.current === 0
  ) {
    enemyLeftGameRef.current = true;
    time.current = seconds;
    // // console.log("current time: " + time.current + "seconds: " + seconds);
    handleTime(time.current, rightUserRef.current?.id || "");
  } else {
    if (seconds - time.current > 2) {
      toast.error("Enemy left the game");
    // alert("2 time is " + time.current);
      endGame({
        winner: leftUserRef.current?.id || "",
        winnerScore: 77777,
        loser: rightUserRef.current?.id || "",
        loserScore: 0,
      });
      enemyLeftGameRef.current = false;
      gameStartedRef.current = false;
      time.current = 0;
    }
  }
}

function enemyLeftGameFour(
  canvasParams: canvasParamsFour,
  time: React.MutableRefObject<number>,
  enemyLeftGameRef: React.MutableRefObject<boolean>,
  gameStarted: boolean,
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>,
  handleTimeFour: (time: number, username: string) => void,
  handleWhoLeftGame: () => void,
  username: string
) {
  const { canvas, userLeftBottom, userLeftTop, userRightBottom, userRightTop } =
    canvasParams;
  if (canvas === null) return;
  const currnetTime = new Date().getTime();
  const seconds = Math.floor(currnetTime / 1000);
  if (
    (((userLeftTop.current.username === username && seconds % 4 === 0) ||
      (userLeftBottom.current.username === username && seconds % 4 === 1) ||
      (userRightTop.current.username === username && seconds % 4 === 2) ||
      (userRightBottom.current.username === username && seconds % 4 === 3)) &&
      !enemyLeftGameRef.current &&
      seconds !== time.current) ||
    time.current === 0
  ) {
    enemyLeftGameRef.current = true;
    time.current = seconds;
    // // console.log("current time: " + time.current + "seconds: " + seconds);
    handleTimeFour(time.current, username);
  } else {
    if (seconds - time.current > 4 && gameStarted) {
      setGameStarted(false);
      handleWhoLeftGame();
    }
  }
}

export { enemyLeftGame, enemyLeftGameFour };
