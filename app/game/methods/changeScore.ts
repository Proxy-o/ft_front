import { User } from "@/lib/types";
import { canvasParams, canvasParamsFour } from "../types";

function changeScoreOnline(
  canvasParams: canvasParams,
  newAngleRef: React.MutableRefObject<number>,
  handleChangeBallDirection: (
    x: number,
    y: number,
    angle: number,
    user: string
  ) => void,
  handleEnemyScore: (
    user1: string,
    score: number,
    user2: string,
    score2: number
  ) => void,
  rightUser: User | undefined,
  leftUser: User | undefined
) {
  const {
    canvas,
    newBallPositionRef,
    isFirstTime,
    rightScoreRef,
    leftScoreRef,
  } = canvasParams;
  if (canvas === null) return;
  if (newBallPositionRef.current.x < -50) {
    isFirstTime.current = true;
    rightScoreRef.current = rightScoreRef.current + 1;
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
    handleEnemyScore(
      leftUser?.username || "",
      leftScoreRef.current,
      rightUser?.username || "",
      rightScoreRef.current
    );
  }
}

function changeScoreFour(
  canvasParams: canvasParamsFour,
  setRightScore: (score: number) => void,
  setLeftScore: (score: number) => void,
  newAngleRef: React.MutableRefObject<number>,
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
  handleEnemyScoreFour: (
    score: number,
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
    isFirstTime,
    rightScoreRef,
    leftScoreRef,
    userLeftTop: leftUserTop,
    userLeftBottom: leftUserBottom,
    userRightTop: rightUserTop,
    userRightBottom: rightUserBottom,
  } = canvasParams;
  if (canvas === null) return;
  if (
    newBallPositionRef.current.x < -50 ||
    newBallPositionRef.current.x > canvas.width + 50
  ) {
    isFirstTime.current = true;
    if (newBallPositionRef.current.x < -50) {
      rightScoreRef.current = rightScoreRef.current + 1;
      setRightScore(rightScoreRef.current);
    } else if (newBallPositionRef.current.x > canvas.width + 50) {
      leftScoreRef.current = leftScoreRef.current + 1;
      setLeftScore(leftScoreRef.current);
    }
    if (
      (username === leftUserTop?.username &&
        newBallPositionRef.current.x < -50) ||
      (username === rightUserTop?.username &&
        newBallPositionRef.current.x > canvas.width + 50)
    ) {
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

      handleEnemyScoreFour(
        username === rightUserTop?.username ||
          username === rightUserBottom?.username
          ? leftScoreRef.current
          : rightScoreRef.current,
        username,
        leftUserTop?.username || "",
        leftUserBottom?.username || "",
        rightUserTop?.username || "",
        rightUserBottom?.username || ""
      );
    }
  }
}

export { changeScoreOnline, changeScoreFour };
