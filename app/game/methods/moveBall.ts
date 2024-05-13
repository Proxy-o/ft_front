import { User } from "@/lib/types";
import { canvasParams, canvasParamsFour } from "../types";

function moveBall(
  canvasParams: canvasParams,
  user: User | undefined,
  leftUser: User | undefined,
  newAngleRef: React.MutableRefObject<number>
) {
  const { newBallPositionRef, isFirstTime } = canvasParams;
  if (isFirstTime.current == true) {
    if (user?.username === leftUser?.username)
      newBallPositionRef.current.x += Math.cos(newAngleRef.current) * 3;
    else newBallPositionRef.current.x -= Math.cos(newAngleRef.current) * 3;
    newBallPositionRef.current.y += Math.sin(newAngleRef.current) * 3;
  } else {
    if (user?.username === leftUser?.username)
      newBallPositionRef.current.x += Math.cos(newAngleRef.current) * 8;
    else newBallPositionRef.current.x -= Math.cos(newAngleRef.current) * 8;
    newBallPositionRef.current.y += Math.sin(newAngleRef.current) * 8;
  }
}

function moveBallFour(
  canvasParams: canvasParamsFour,
  user: User | undefined,
  leftUserTop: User | undefined,
  leftUserBottom: User | undefined,
  newAngleRef: React.MutableRefObject<number>
) {
  const { newBallPositionRef, isFirstTime } = canvasParams;
  if (isFirstTime.current == true) {
    newBallPositionRef.current.x += Math.cos(newAngleRef.current) * 3;
    newBallPositionRef.current.y += Math.sin(newAngleRef.current) * 3;
  } else {
    newBallPositionRef.current.x += Math.cos(newAngleRef.current) * 8;
    newBallPositionRef.current.y += Math.sin(newAngleRef.current) * 8;
  }
}

export { moveBall, moveBallFour };