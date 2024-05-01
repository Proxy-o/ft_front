import { User } from "@/lib/types";

export type canvasParams = {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D;
  paddleLeftYRef: React.MutableRefObject<number>;
  paddleRightX: number;
  PaddleRightYRef: React.MutableRefObject<number>;
  newBallPositionRef: React.MutableRefObject<{ x: number; y: number }>;
  paddleLeftX: number;
  paddleWidth: number;
  paddleHeight: number;
  ballRadius: number;
  upPressed: boolean;
  downPressed: boolean;
  isFirstTime: React.MutableRefObject<boolean>;
  rightScoreRef: React.MutableRefObject<number>;
};

export type canvasParamsFour = {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D;
  paddleLeftTopYRef: React.MutableRefObject<number>;
  paddleLeftBottomYRef: React.MutableRefObject<number>;
  paddleRightTopYRef: React.MutableRefObject<number>;
  paddleRightBottomYRef: React.MutableRefObject<number>;
  userLeftTop: User | undefined;
  userLeftBottom: User | undefined;
  userRightTop: User | undefined;
  userRightBottom: User | undefined;
  newBallPositionRef: React.MutableRefObject<{ x: number; y: number }>;
  paddleLeftX: number;
  paddleWidth: number;
  paddleHeight: number;
  ballRadius: number;
  isFirstTime: React.MutableRefObject<boolean>;
  rightScoreRef: React.MutableRefObject<number>;
  leftScoreRef: React.MutableRefObject<number>;
};
