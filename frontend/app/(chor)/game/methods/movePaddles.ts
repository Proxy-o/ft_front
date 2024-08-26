import { canvasParams, canvasParamsFour } from "../types";

function movePaddlesOnline(
  canvasParams: canvasParams,
) {
  const { canvas, paddleLeftYRef, upPressedRef, downPressedRef, paddleHeight, paddleRightDirectionRef, PaddleRightYRef } =
    canvasParams;
  if (canvas === null) return;
  if (upPressedRef.current && paddleLeftYRef.current > 0) {
    if (paddleLeftYRef.current - 6 < 0) {
      paddleLeftYRef.current = 0;
    } else {
      paddleLeftYRef.current -= 6;
    }
    // handleMovePaddle(paddleLeftYRef.current);
    // upPressedRef.current = false;
  } else if (
    downPressedRef.current &&
    paddleLeftYRef.current < canvas.height - paddleHeight
  ) {
    if (paddleLeftYRef.current + 6 > canvas.height - paddleHeight) {
      paddleLeftYRef.current = canvas.height - paddleHeight;
    } else {
      paddleLeftYRef.current += 6;
    }
    // handleMovePaddle(paddleLeftYRef.current);
    // downPressedRef.current = false;
  }
  if (paddleRightDirectionRef.current === "up") {
    if (PaddleRightYRef.current - 6 < 0) {
      PaddleRightYRef.current = 0;
    } else {
      PaddleRightYRef.current -= 6;
    }
    // handleMovePaddle(PaddleRightYRef.current);
  } else if (paddleRightDirectionRef.current === "down") {
    if (PaddleRightYRef.current + 6 > canvas.height - paddleHeight) {
      PaddleRightYRef.current = canvas.height - paddleHeight;
    } else {
      PaddleRightYRef.current += 6;
    }
    // handleMovePaddle(PaddleRightYRef.current);
  }
}

function movePaddlesFour(
  canvasParams: canvasParamsFour,
  handleMovePaddleFour: (y: number, user: string) => void,
  username: string,
  myPaddleRef: React.MutableRefObject<number>,
  upPressedRef: React.MutableRefObject<boolean>,
  downPressedRef: React.MutableRefObject<boolean>
) {
  const {
    canvas,
    paddleLeftTopYRef,
    paddleLeftBottomYRef,
    paddleRightTopYRef,
    paddleRightBottomYRef,
    paddleHeight,
    userLeftTop: leftUserTop,
    userLeftBottom: leftUserBottom,
    userRightTop: rightUserTop,
    userRightBottom: rightUserBottom,
  } = canvasParams;
  if (canvas === null) return;
  if (upPressedRef.current) {
    if (myPaddleRef.current <= canvas.height / 2 - paddleHeight) {
      if (myPaddleRef.current - 6 < 0) {
        myPaddleRef.current = 0;
      } else {
        myPaddleRef.current -= 6;
      }
    } else {
      if (myPaddleRef.current - 6 <= canvas.height / 2) {
        myPaddleRef.current = canvas.height / 2;
      } else {
        myPaddleRef.current -= 6;
      }
    }
    handleMovePaddleFour(myPaddleRef.current, username);
    // upPressedRef.current = false;
  } else if (downPressedRef.current) {
    if (myPaddleRef.current <= canvas.height / 2 - paddleHeight) {
      if (myPaddleRef.current + 6 >= canvas.height / 2 - paddleHeight) {
        myPaddleRef.current = canvas.height / 2 - paddleHeight;
      } else {
        myPaddleRef.current += 6;
      }
    } else {
      if (myPaddleRef.current + 6 >= canvas.height - paddleHeight) {
        myPaddleRef.current = canvas.height - paddleHeight;
      } else {
        myPaddleRef.current += 6;
      }
    }
    handleMovePaddleFour(myPaddleRef.current, username);
    // downPressedRef.current = false;
  }
  if (username === rightUserTop.current?.username)
    paddleRightTopYRef.current = myPaddleRef.current;
  if (username === rightUserBottom.current?.username)
    paddleRightBottomYRef.current = myPaddleRef.current;
  if (username === leftUserTop.current?.username)
    paddleLeftTopYRef.current = myPaddleRef.current;
  if (username === leftUserBottom.current?.username)
    paddleLeftBottomYRef.current = myPaddleRef.current;
}

export { movePaddlesOnline, movePaddlesFour };
