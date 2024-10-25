import { User } from "@/lib/types";
import React from "react";

export type canvasParams = {
  canvas: HTMLCanvasElement | null;
  paddleLeftYRef: React.MutableRefObject<number>;
  newAngleRef: React.MutableRefObject<number>;
  paddleRightX: number;
  enemyLeftGameRef: React.MutableRefObject<boolean>;
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  PaddleRightYRef: React.MutableRefObject<number>;
  ballInLeftPaddle: React.MutableRefObject<boolean>;
  paddleRightDirectionRef: React.MutableRefObject<string>;
  newBallPositionRef: React.MutableRefObject<{ x: number; y: number }>;
  nextAngleRef: React.MutableRefObject<number>;
  paddleLeftX: number;
  paddleWidth: number;
  paddleHeight: number;
  ballRadius: number;
  upPressedRef: React.MutableRefObject<boolean>;
  downPressedRef: React.MutableRefObject<boolean>;
  isFirstTime: React.MutableRefObject<boolean>;
  rightScoreRef: React.MutableRefObject<number>;
  leftScoreRef: React.MutableRefObject<number>;
  leftUserRef: React.MutableRefObject<User | undefined>;
  rightUserRef: React.MutableRefObject<User | undefined>;
  gameIdRef: React.MutableRefObject<string>;
};

export type canvasParamsFour = {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D;
  paddleLeftTopYRef: React.MutableRefObject<number>;
  paddleLeftBottomYRef: React.MutableRefObject<number>;
  paddleRightTopYRef: React.MutableRefObject<number>;
  paddleRightBottomYRef: React.MutableRefObject<number>;
  paddleLeftTopDirectionRef: React.MutableRefObject<string>;
  paddleLeftBottomDirectionRef: React.MutableRefObject<string>;
  paddleRightTopDirectionRef: React.MutableRefObject<string>;
  paddleRightBottomDirectionRef: React.MutableRefObject<string>;
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
  gameId: string;
};
