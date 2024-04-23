import { User } from "@/lib/types";
import { canvasParams } from "../types";

function changeBallDirectionOnline(
  canvasParams: canvasParams,
  newAngleRef: React.MutableRefObject<number>,
  ballInLeftPaddle: boolean,
  handleChangeBallDirection: (
    x: number,
    y: number,
    angle: number,
    user: string
  ) => void,
  rightUser: User | undefined
) {
  const {
    canvas,
    paddleLeftYRef,
    newBallPositionRef,
    paddleLeftX,
    paddleWidth,
    paddleHeight,
    ballRadius,
    isFirstTime,
  } = canvasParams;
  if (canvas === null) return;
  if (
    newBallPositionRef.current.x < paddleLeftX + paddleWidth + ballRadius &&
    newBallPositionRef.current.x > paddleLeftX + ballRadius &&
    newBallPositionRef.current.y + ballRadius / 2 > paddleLeftYRef.current &&
    newBallPositionRef.current.y - ballRadius / 2 <
      paddleLeftYRef.current + paddleHeight
  ) {
    isFirstTime.current = false;
    if (!ballInLeftPaddle) {
      let ballPositionOnPaddle =
        newBallPositionRef.current.y - paddleLeftYRef.current;
      let ballPercentageOnPaddle = ballPositionOnPaddle / paddleHeight;
      if (
        newBallPositionRef.current.y <
        paddleLeftYRef.current + paddleHeight / 2
      ) {
        newAngleRef.current =
          ((-Math.PI * 2) / 6) * (0.5 - ballPercentageOnPaddle);
      } else {
        newAngleRef.current =
          ((Math.PI * 2) / 6) * (ballPercentageOnPaddle - 0.5);
      }
      let enemyX = canvas.width - newBallPositionRef.current.x;
      let enemyY = newBallPositionRef.current.y;
      let enemyAngle = Math.PI - newAngleRef.current;
      handleChangeBallDirection(
        enemyX,
        enemyY,
        enemyAngle,
        rightUser?.username || ""
      );
      ballInLeftPaddle = true;
    }
  } else {
    ballInLeftPaddle = false;
  }
}

export default changeBallDirectionOnline;
