import { User } from "@/lib/types";
import { canvasParams, canvasParamsFour } from "../types";

function moveBall(
  canvasParams: canvasParams,
  user: User | undefined,
  leftUser: User | undefined,
  newAngleRef: React.MutableRefObject<number>
) {
  const { newBallPositionRef, isFirstTime } = canvasParams;
  // let speed: number;
  if (isFirstTime.current == true) {
    if (user?.username === leftUser?.username) {
      newBallPositionRef.current.x += Math.cos(newAngleRef.current) * 6;
    } else {
      newBallPositionRef.current.x -= Math.cos(newAngleRef.current) * 6;
    }
    newBallPositionRef.current.y += Math.sin(newAngleRef.current) * 6;
  } else {
    if (user?.username === leftUser?.username) {
      newBallPositionRef.current.x += Math.cos(newAngleRef.current) * 18;
    } else {
      newBallPositionRef.current.x -= Math.cos(newAngleRef.current) * 18;
    }
    newBallPositionRef.current.y += Math.sin(newAngleRef.current) * 18;
  }
}

function moveBallFour(
  canvasParams: canvasParamsFour,
  newAngleRef: React.MutableRefObject<number>
) {
  const { newBallPositionRef, isFirstTime } = canvasParams;
  if (isFirstTime.current == true) {
    newBallPositionRef.current.x += Math.cos(newAngleRef.current) * 6;
    newBallPositionRef.current.y += Math.sin(newAngleRef.current) * 6;
  } else {
    newBallPositionRef.current.x += Math.cos(newAngleRef.current) * 18;
    newBallPositionRef.current.y += Math.sin(newAngleRef.current) * 18;
  }
}

export { moveBall, moveBallFour };
