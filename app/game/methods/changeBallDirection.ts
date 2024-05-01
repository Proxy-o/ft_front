import { User } from "@/lib/types";
import { canvasParams, canvasParamsFour } from "../types";

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

function changeBallDirectionFour(
  canvasParams: canvasParamsFour,
  newAngleRef: React.MutableRefObject<number>,
  ballInLeftPaddle: boolean,
  rightUserBottom: User | undefined,
  rightUserTop: User | undefined,
  leftUserBottom: User | undefined,
  leftUserTop: User | undefined,
  myPaddleRef: React.MutableRefObject<number>,
  paddleRightX: number,
  ballInRightPaddle: boolean,
  handleChangeBallDirectionFour: (
    x: number,
    y: number,
    angle: number,
    user: string,
    leftUserTop: string,
    leftUserBottom: string,
    rightUserTop: string,
    rightUserBottom: string
  ) => void,
  username: string
) {
  const {
    canvas,
    newBallPositionRef,
    paddleLeftX,
    paddleWidth,
    paddleHeight,
    ballRadius,
    isFirstTime,
  } = canvasParams;
  if (canvas === null) return;
  if (
    (username === leftUserTop?.username ||
      username === leftUserBottom?.username) &&
    newBallPositionRef.current.x < paddleLeftX + paddleWidth + ballRadius &&
    newBallPositionRef.current.x > paddleLeftX + ballRadius &&
    newBallPositionRef.current.y + ballRadius / 2 > myPaddleRef.current &&
    newBallPositionRef.current.y - ballRadius / 2 <
      myPaddleRef.current + paddleHeight
  ) {
    isFirstTime.current = false;
    if (!ballInLeftPaddle) {
      let ballPositionOnPaddle =
        newBallPositionRef.current.y - myPaddleRef.current;
      let ballPercentageOnPaddle = ballPositionOnPaddle / paddleHeight;
      if (
        newBallPositionRef.current.y <
        myPaddleRef.current + paddleHeight / 2
      ) {
        newAngleRef.current =
          ((-Math.PI * 2) / 6) * (0.5 - ballPercentageOnPaddle);
      } else {
        newAngleRef.current =
          ((Math.PI * 2) / 6) * (ballPercentageOnPaddle - 0.5);
      }
      handleChangeBallDirectionFour(
        newBallPositionRef.current.x,
        newBallPositionRef.current.y,
        newAngleRef.current,
        username,
        leftUserTop?.username || "",
        leftUserBottom?.username || "",
        rightUserTop?.username || "",
        rightUserBottom?.username || ""
      );
      ballInLeftPaddle = true;
    }
  } else {
    ballInLeftPaddle = false;
  }
  if (
    (username === rightUserTop?.username ||
      username === rightUserBottom?.username) &&
    newBallPositionRef.current.x > paddleRightX - ballRadius &&
    newBallPositionRef.current.x < paddleRightX + ballRadius &&
    newBallPositionRef.current.y + ballRadius / 2 > myPaddleRef.current &&
    newBallPositionRef.current.y - ballRadius / 2 <
      myPaddleRef.current + paddleHeight
  ) {
    isFirstTime.current = false;
    if (!ballInRightPaddle) {
      let ballPositionOnPaddle =
        newBallPositionRef.current.y - myPaddleRef.current;
      let ballPercentageOnPaddle = ballPositionOnPaddle / paddleHeight;
      if (
        newBallPositionRef.current.y <
        myPaddleRef.current + paddleHeight / 2
      ) {
        newAngleRef.current =
          ((-Math.PI * 2) / 6) * (0.5 - ballPercentageOnPaddle);
      } else {
        newAngleRef.current =
          ((Math.PI * 2) / 6) * (ballPercentageOnPaddle - 0.5);
      }
      newAngleRef.current = Math.PI - newAngleRef.current;
      handleChangeBallDirectionFour(
        newBallPositionRef.current.x,
        newBallPositionRef.current.y,
        newAngleRef.current,
        username,
        leftUserTop?.username || "",
        leftUserBottom?.username || "",
        rightUserTop?.username || "",
        rightUserBottom?.username || ""
      );
      ballInRightPaddle = true;
    }
  } else {
    ballInRightPaddle = false;
  }
}

export { changeBallDirectionOnline, changeBallDirectionFour };
