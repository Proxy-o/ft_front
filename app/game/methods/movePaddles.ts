import { User } from "@/lib/types";
import { canvasParams, canvasParamsFour } from "../types";
import { toast } from "sonner";

function movePaddlesOnline(
  canvasParams: canvasParams,
  handleMovePaddle: (y: number, user: string, sender: string) => void,
  rightUser: User | undefined,
  username: string
) {
  const { canvas, paddleLeftYRef, upPressedRef, downPressedRef, paddleHeight } =
    canvasParams;
  if (canvas === null) return;
  if (upPressedRef.current && paddleLeftYRef.current > 0) {
    if (paddleLeftYRef.current - 25 < 0) {
      paddleLeftYRef.current = 0;
    } else {
      paddleLeftYRef.current -= 25;
    }
    handleMovePaddle(
      paddleLeftYRef.current,
      rightUser?.username || "",
      username
    );
  } else if (
    downPressedRef.current &&
    paddleLeftYRef.current < canvas.height - paddleHeight
  ) {
    if (paddleLeftYRef.current + 25 > canvas.height - paddleHeight) {
      paddleLeftYRef.current = canvas.height - paddleHeight;
    } else {
      paddleLeftYRef.current += 25;
    }
    handleMovePaddle(
      paddleLeftYRef.current,
      rightUser?.username || "",
      username
    );
  }
}

function movePaddlesFour(
  canvasParams: canvasParamsFour,
  handleMovePaddle: (y: number, user: string, sender: string) => void,
  leftUserTop: User | undefined,
  leftUserBottom: User | undefined,
  rightUserTop: User | undefined,
  rightUserBottom: User | undefined,
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
  } = canvasParams;
  if (canvas === null) return;
  if (upPressedRef.current) {
    if (myPaddleRef.current <= canvas.height / 2 - paddleHeight) {
      if (myPaddleRef.current - 25 < 0) {
        myPaddleRef.current = 0;
      } else {
        myPaddleRef.current -= 25;
      }
      upPressedRef.current = false;
    } else {
      if (myPaddleRef.current - 25 <= canvas.height / 2) {
        myPaddleRef.current = canvas.height / 2;
      } else {
        myPaddleRef.current -= 25;
      }
    }
    upPressedRef.current = false;
  } else if (downPressedRef.current) {
    if (myPaddleRef.current <= canvas.height / 2 - paddleHeight) {
      if (myPaddleRef.current + 25 >= canvas.height / 2 - paddleHeight) {
        myPaddleRef.current = canvas.height / 2 - paddleHeight;
      } else {
        myPaddleRef.current += 25;
      }
    } else {
      if (myPaddleRef.current + 25 >= canvas.height - paddleHeight) {
        myPaddleRef.current = canvas.height - paddleHeight;
      } else {
        myPaddleRef.current += 25;
      }
    }
    downPressedRef.current = false;
  }
  if (
    (username === rightUserTop?.username &&
      myPaddleRef.current !== paddleRightTopYRef.current) ||
    (username === rightUserBottom?.username &&
      myPaddleRef.current !== paddleRightBottomYRef.current) ||
    (username === leftUserTop?.username &&
      myPaddleRef.current !== paddleLeftTopYRef.current) ||
    (username === leftUserBottom?.username &&
      myPaddleRef.current !== paddleLeftBottomYRef.current)
  ) {
    if (username !== leftUserTop?.username)
      handleMovePaddle(
        myPaddleRef.current,
        leftUserTop?.username || "",
        username
      );
    if (username !== leftUserBottom?.username)
      handleMovePaddle(
        myPaddleRef.current,
        leftUserBottom?.username || "",
        username
      );
    if (username !== rightUserTop?.username)
      handleMovePaddle(
        myPaddleRef.current,
        rightUserTop?.username || "",
        username
      );
    if (username !== rightUserBottom?.username)
      handleMovePaddle(
        myPaddleRef.current,
        rightUserBottom?.username || "",
        username
      );
  }
  if (username === rightUserTop?.username)
    paddleRightTopYRef.current = myPaddleRef.current;
  if (username === rightUserBottom?.username)
    paddleRightBottomYRef.current = myPaddleRef.current;
  if (username === leftUserTop?.username)
    paddleLeftTopYRef.current = myPaddleRef.current;
  if (username === leftUserBottom?.username)
    paddleLeftBottomYRef.current = myPaddleRef.current;
}

export { movePaddlesOnline, movePaddlesFour };
