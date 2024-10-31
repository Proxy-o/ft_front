import { User } from "@/lib/types";
import { canvasParams, canvasParamsFour } from "../types";

function changeBallDirectionOnline(
  canvasParams: canvasParams,
  newAngleRef: React.MutableRefObject<number>,
  ballInLeftPaddle: React.MutableRefObject<boolean>,
  ballInRightPaddle: React.MutableRefObject<boolean>,
  handleChangeBallDirection: (
    x: number,
    y: number,
    angle: number,
    user1: string,
    user2: string
  ) => void,
  rightUser: User | undefined,
  leftUser: User | undefined
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
  let newAngle = 0;
  if (
    newBallPositionRef.current.x < paddleLeftX + paddleWidth + ballRadius / 2 &&
    newBallPositionRef.current.x > paddleLeftX &&
    newBallPositionRef.current.y + ballRadius / 2 > paddleLeftYRef.current &&
    newBallPositionRef.current.y - ballRadius / 2 <
      paddleLeftYRef.current + paddleHeight
  ) {
    isFirstTime.current = false;
    if (!ballInLeftPaddle.current) {
      let ballPositionOnPaddle =
        newBallPositionRef.current.y - paddleLeftYRef.current;
      let ballPercentageOnPaddle = ballPositionOnPaddle / paddleHeight;
      if (
        newBallPositionRef.current.y <
        paddleLeftYRef.current + paddleHeight / 2
      ) {
        newAngle = ((-Math.PI * 2) / 6) * (0.5 - ballPercentageOnPaddle);
      } else {
        newAngle = ((Math.PI * 2) / 6) * (ballPercentageOnPaddle - 0.5);
      }
      handleChangeBallDirection(
        newBallPositionRef.current.x,
        newBallPositionRef.current.y,
        newAngle,
        rightUser?.username || "",
        leftUser?.username || ""
      );
      ballInLeftPaddle.current = true;
    }
  } else {
    ballInLeftPaddle.current = false;
  }
  if (!isFirstTime.current) {
    // console.log("newBallPositionRef.current.x", newBallPositionRef.current.x);
    // if (
    //   newBallPositionRef.current.x >
    //     canvas.width - ballRadius - paddleWidth - 100 &&
    //   newBallPositionRef.current.x < canvas.width - ballRadius - 100 &&
    //   newBallPositionRef.current.y + ballRadius / 2 > PaddleRightYRef.current &&
    //   newBallPositionRef.current.y - ballRadius / 2 <
    //   PaddleRightYRef.current + paddleHeight &&
    //   !ballInRightPaddle.current
    // ) {
    //   newAngleRef.current = nextAngleRef.current;
    //   ballInRightPaddle.current = true;
    // } else {
    //   ballInRightPaddle.current = false;
    // }
  }
}

function changeBallDirectionFour(
  canvasParams: canvasParamsFour,
  newAngleRef: React.MutableRefObject<number>,
  ballInLeftPaddle: boolean,
  myPaddleRef: React.MutableRefObject<number>,
  paddleRightX: number,
  ballInRightPaddle: boolean,
  handleChangeBallDirectionFour: (
    x: number,
    y: number,
    angle: number,
    user: string
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
    userLeftTop: leftUserTop,
    userLeftBottom: leftUserBottom,
    userRightTop: rightUserTop,
    userRightBottom: rightUserBottom,
  } = canvasParams;
  if (canvas === null) return;
  if (
    (username === leftUserTop.current?.username ||
      username === leftUserBottom.current?.username) &&
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
        username
      );
      ballInLeftPaddle = true;
    }
  } else {
    ballInLeftPaddle = false;
  }
  if (
    (username === rightUserTop.current?.username ||
      username === rightUserBottom.current?.username) &&
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
        username
      );
      ballInRightPaddle = true;
    }
  } else {
    ballInRightPaddle = false;
  }
}

export { changeBallDirectionOnline, changeBallDirectionFour };
