import { User } from "@/lib/types";
import { canvasParams, canvasParamsFour } from "../types";
import { toast } from "sonner";

function movePaddlesOnline(
  canvasParams: canvasParams,
  handleMovePaddle: (y: number, user: string) => void,
  rightUser: User | undefined
) {
  const { canvas, paddleLeftYRef, upPressed, downPressed, paddleHeight } =
    canvasParams;
  if (canvas === null) return;
  if (upPressed && paddleLeftYRef.current > 0) {
    if (paddleLeftYRef.current - 6 < 0) {
      paddleLeftYRef.current = 0;
    } else {
      paddleLeftYRef.current -= 6;
    }
    handleMovePaddle(paddleLeftYRef.current, rightUser?.username || "");
  } else if (
    downPressed &&
    paddleLeftYRef.current < canvas.height - paddleHeight
  ) {
    if (paddleLeftYRef.current + 6 > canvas.height - paddleHeight) {
      paddleLeftYRef.current = canvas.height - paddleHeight;
    } else {
      paddleLeftYRef.current += 6;
    }
    handleMovePaddle(paddleLeftYRef.current, rightUser?.username || "");
  }
}

function movePaddlesFour(
  canvasParams: canvasParamsFour,
  handleMovePaddleFour: (
    y: number,
    user: string,
    leftUserTop: string,
    leftUserBottom: string,
    rightUserTop: string,
    rightUserBottom: string
  ) => void,
  leftUserTop: User | undefined,
  leftUserBottom: User | undefined,
  rightUserTop: User | undefined,
  rightUserBottom: User | undefined,
  username: string,
  myPaddleRef: React.MutableRefObject<number>,
  upPressed: boolean,
  downPressed: boolean
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
  console.log("myPaddleRef", myPaddleRef.current);
  if (upPressed) {
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
    handleMovePaddleFour(
      myPaddleRef.current,
      username,
      leftUserTop?.username || "",
      leftUserBottom?.username || "",
      rightUserTop?.username || "",
      rightUserBottom?.username || ""
    );
  } else if (downPressed) {
    if (myPaddleRef.current <= canvas.height / 2 - paddleHeight) {
      if (myPaddleRef.current + 6 > canvas.height / 2 - paddleHeight) {
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
    handleMovePaddleFour(
      myPaddleRef.current,
      username,
      leftUserTop?.username || "",
      leftUserBottom?.username || "",
      rightUserTop?.username || "",
      rightUserBottom?.username || ""
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
