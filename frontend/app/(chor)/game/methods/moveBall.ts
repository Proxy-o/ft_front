import { User } from "@/lib/types";
import { canvasParams, canvasParamsFour } from "../types";

function moveBall(
  canvasParams: canvasParams,
  user: User | undefined,
  leftUser: User | undefined,
  newAngleRef: React.MutableRefObject<number>
) {
  const { newBallPositionRef, isFirstTime } = canvasParams;
  let speed: number;
  if (isFirstTime.current == true) {
    if (user?.username === leftUser?.username) {
      newBallPositionRef.current.x += Math.cos(newAngleRef.current) * 3;
    } else {
      newBallPositionRef.current.x -= Math.cos(newAngleRef.current) * 3;
    }
    newBallPositionRef.current.y += Math.sin(newAngleRef.current) * 3;
  } else {
    if (
      newAngleRef.current > Math.PI / 4 &&
      newAngleRef.current < Math.PI * 3 / 4
    ) {
      speed = 10;
    } else {
      speed = 7;
    }
    if (user?.username === leftUser?.username) {
      newBallPositionRef.current.x += Math.cos(newAngleRef.current) * speed;
    } else {
      newBallPositionRef.current.x -= Math.cos(newAngleRef.current) * speed;
    }
    newBallPositionRef.current.y += Math.sin(newAngleRef.current) * speed;
  }
}

function moveBallFour(
  canvasParams: canvasParamsFour,
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
