import { User } from "@/lib/types";
import { canvasParams } from "../types";

function changeScoreOnline(
  canvasParams: canvasParams,
  setRightScore: (score: number) => void,
  newAngleRef: React.MutableRefObject<number>,
  handleChangeBallDirection: (
    x: number,
    y: number,
    angle: number,
    user: string
  ) => void,
  handleEnemyScore: (score: number, user: string) => void,
  rightUser: User | undefined
) {
  const { canvas, newBallPositionRef, isFirstTime, rightScoreRef } =
    canvasParams;
  if (canvas === null) return;
  if (newBallPositionRef.current.x < -50) {
    isFirstTime.current = true;
    rightScoreRef.current = rightScoreRef.current + 1;
    setRightScore(rightScoreRef.current);
    newBallPositionRef.current.x = canvas.width / 2;
    newAngleRef.current = Math.random() * 2 * Math.PI;
    while (
      (newAngleRef.current > Math.PI / 6 &&
        newAngleRef.current < (Math.PI * 5) / 6) ||
      (newAngleRef.current > (Math.PI * 7) / 6 &&
        newAngleRef.current < (Math.PI * 11) / 6)
    ) {
      newAngleRef.current = Math.random() * 2 * Math.PI;
    }
    let enemyAngle = Math.PI - newAngleRef.current;
    handleChangeBallDirection(
      newBallPositionRef.current.x,
      newBallPositionRef.current.y,
      enemyAngle,
      rightUser?.username || ""
    );
    handleEnemyScore(rightScoreRef.current, rightUser?.username || "");
  }
}

export default changeScoreOnline;
