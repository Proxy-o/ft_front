import { canvasParams, canvasParamsFour } from "../types";

function draw(canvasParams: canvasParams, ctx: CanvasRenderingContext2D) {
  const {
    paddleLeftYRef,
    paddleRightX,
    PaddleRightYRef,
    newBallPositionRef,
    paddleLeftX,
    paddleWidth,
    paddleHeight,
    ballRadius,
  } = canvasParams;
  const drawBall = () => {
    ctx.beginPath();
    ctx.arc(
      newBallPositionRef.current.x,
      newBallPositionRef.current.y,
      ballRadius,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  };

  const drawRightPaddle = () => {
    ctx.beginPath();
    ctx.rect(paddleRightX, PaddleRightYRef.current, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  };

  const drawLeftPaddle = () => {
    ctx.beginPath();
    ctx.rect(paddleLeftX, paddleLeftYRef.current, paddleWidth, paddleHeight);
    ctx.fillStyle = "#ee95DD";
    ctx.fill();
    ctx.closePath();
  };
  drawBall();
  drawRightPaddle();
  drawLeftPaddle();
}

function drawFour(canvasParams: canvasParamsFour) {
  const {
    ctx,
    paddleLeftTopYRef,
    paddleLeftBottomYRef,
    paddleRightTopYRef,
    paddleRightBottomYRef,
    newBallPositionRef,
    paddleLeftX,
    paddleWidth,
    paddleHeight,
    ballRadius,
    paddleRightX,
  } = canvasParams;
  const drawBall = () => {
    ctx.beginPath();
    ctx.arc(
      newBallPositionRef.current.x,
      newBallPositionRef.current.y,
      ballRadius,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  };

  const drawRightPaddle = () => {
    ctx.beginPath();
    ctx.rect(
      paddleRightX,
      paddleRightTopYRef.current,
      paddleWidth,
      paddleHeight
    );
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  };

  const drawLeftPaddle = () => {
    ctx.beginPath();
    ctx.rect(paddleLeftX, paddleLeftTopYRef.current, paddleWidth, paddleHeight);
    ctx.fillStyle = "#ee95DD";
    ctx.fill();
    ctx.closePath();
  };

  const drawLeftPaddleTwo = () => {
    ctx.beginPath();
    ctx.rect(
      paddleLeftX,
      paddleLeftBottomYRef.current,
      paddleWidth,
      paddleHeight
    );
    ctx.fillStyle = "#ee95DD";
    ctx.fill();
    ctx.closePath();
  };

  const drawRightPaddleTwo = () => {
    ctx.beginPath();
    ctx.rect(
      paddleRightX,
      paddleRightBottomYRef.current,
      paddleWidth,
      paddleHeight
    );
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  };
  drawBall();
  drawRightPaddle();
  drawLeftPaddle();
  drawLeftPaddleTwo();
  drawRightPaddleTwo();
}

export { draw, drawFour };
