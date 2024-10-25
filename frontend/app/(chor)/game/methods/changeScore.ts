import { User } from "@/lib/types";
import { canvasParams, canvasParamsFour } from "../types";

function changeScoreOnline(
  canvasParams: canvasParams,
  newAngleRef: React.MutableRefObject<number>,
  handleChangeBallDirection: (
    x: number,
    y: number,
    angle: number,
    user: string
  ) => void,
  handleEnemyScore: (gameId: string) => void,
  rightUser: User | undefined,
  leftUser: User | undefined
) {
  const { canvas, newBallPositionRef, gameIdRef } = canvasParams;
  if (canvas === null) return;
  if (newBallPositionRef.current.x < -100) {
    newBallPositionRef.current.x = canvas.width / 2;
    newBallPositionRef.current.y = canvas.height / 2;
    newAngleRef.current = 0;
    handleChangeBallDirection(
      newBallPositionRef.current.x,
      newBallPositionRef.current.y,
      0,
      rightUser?.username || ""
    );
    handleEnemyScore(gameIdRef.current);
  }
}

function changeScoreFour(
  canvasParams: canvasParamsFour,
  newAngleRef: React.MutableRefObject<number>,
  handleChangeBallDirectionFour: (
    x: number,
    y: number,
    angle: number,
    user: string
  ) => void,
  handleEnemyScoreFour: (gameId: string) => void,
  username: string
) {
  const {
    canvas,
    newBallPositionRef,
    isFirstTime,
    userLeftTop: leftUserTop,
    userLeftBottom: leftUserBottom,
    userRightTop: rightUserTop,
    userRightBottom: rightUserBottom,
    gameId,
  } = canvasParams;
  if (canvas === null) return;
  if (
    (newBallPositionRef.current.x < -50 &&
      ((newBallPositionRef.current.y < canvas.height / 2 &&
        username === leftUserTop?.current.username) ||
        (newBallPositionRef.current.y >= canvas.height / 2 &&
          username === leftUserBottom?.current.username))) ||
    (newBallPositionRef.current.x > canvas.width + 50 &&
      ((newBallPositionRef.current.y < canvas.height / 2 &&
        username === rightUserTop?.current.username) ||
        (newBallPositionRef.current.y >= canvas.height / 2 &&
          username === rightUserBottom?.current.username)))
  ) {
    isFirstTime.current = true;
    newBallPositionRef.current = { x: canvas.width / 2, y: canvas.height / 2 };
    newAngleRef.current = Math.random() * 2 * Math.PI;
    while (
      (newAngleRef.current > Math.PI / 6 &&
        newAngleRef.current < (Math.PI * 5) / 6) ||
      (newAngleRef.current > (Math.PI * 7) / 6 &&
        newAngleRef.current < (Math.PI * 11) / 6)
    ) {
      newAngleRef.current = Math.random() * 2 * Math.PI;
    }
    handleChangeBallDirectionFour(
      newBallPositionRef.current.x,
      newBallPositionRef.current.y,
      newAngleRef.current,
      username
    );
    handleEnemyScoreFour(gameId);
  }
}

export { changeScoreOnline, changeScoreFour };
