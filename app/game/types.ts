import { User } from "@/lib/types";

export type canvasParams = {
  canvas: HTMLCanvasElement | null;
  paddleLeftYRef: React.MutableRefObject<number>;
  paddleRightX: number;
  PaddleRightYRef: React.MutableRefObject<number>;
  newBallPositionRef: React.MutableRefObject<{ x: number; y: number }>;
  paddleLeftX: number;
  paddleWidth: number;
  paddleHeight: number;
  ballRadius: number;
  upPressedRef: React.MutableRefObject<boolean>;
  downPressedRef: React.MutableRefObject<boolean>;
  isFirstTime: React.MutableRefObject<boolean>;
  rightScoreRef: React.MutableRefObject<number>;
  leftScoreRef: React.MutableRefObject<number>;
};

export type canvasParamsFour = {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D;
  paddleLeftTopYRef: React.MutableRefObject<number>;
  paddleLeftBottomYRef: React.MutableRefObject<number>;
  paddleRightTopYRef: React.MutableRefObject<number>;
  paddleRightBottomYRef: React.MutableRefObject<number>;
  userLeftTop: React.MutableRefObject<User>;
  userLeftBottom: React.MutableRefObject<User>;
  userRightTop: React.MutableRefObject<User>;
  userRightBottom: React.MutableRefObject<User>;
  newBallPositionRef: React.MutableRefObject<{ x: number; y: number }>;
  paddleLeftX: number;
  paddleRightX: number;
  paddleWidth: number;
  paddleHeight: number;
  ballRadius: number;
  isFirstTime: React.MutableRefObject<boolean>;
  rightScoreRef: React.MutableRefObject<number>;
  leftScoreRef: React.MutableRefObject<number>;
};
