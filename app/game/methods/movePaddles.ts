import { User } from "@/lib/types";
import { canvasParams } from "../types";

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

export default movePaddlesOnline;
