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
