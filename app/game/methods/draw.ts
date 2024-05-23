import { canvasParams, canvasParamsFour } from "../types";

function draw(canvasParams: canvasParams, ctx: CanvasRenderingContext2D) {
  const {
    canvas,
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

  const drawMiddleLine = () => {
    if (canvas === null) return;
    ctx.beginPath();
    ctx.rect(0, canvas.height / 2 - 1, canvas.width, 2);
    ctx.fillStyle = "#ee95DD";
    ctx.fill();
    ctx.closePath();
  };

  drawBall();
  drawRightPaddle();
  drawLeftPaddle();
  drawMiddleLine();
}

function drawFour(canvasParams: canvasParamsFour) {
  const {
    canvas,
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
    leftScoreRef,
    rightScoreRef,
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

  const drawMiddleLine = () => {
    if (canvas === null) return;
    let i = 0;
    while (i < canvas.width) {
      ctx.beginPath();
      ctx.rect(i, canvas.height / 2 - 2, 7, 4);
      ctx.fillStyle = "#ee95DD";
      ctx.fill();
      ctx.closePath();
      i += 15;
    }
  };

  const drawScore = () => {
    if (canvas === null) return;
    // italic and bold
    ctx.font = "italic bold 50px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(
      "" + leftScoreRef.current,
      canvas.width / 2 - 150,
      canvas.height / 2 - 20
    );
    ctx.fillText(
      "" + rightScoreRef.current,
      canvas.width / 2 + 150,
      canvas.height / 2 - 20
    );
  };

  drawScore();
  drawRightPaddleTwo();
  drawBall();
  drawMiddleLine();
  drawRightPaddle();
  drawLeftPaddle();
  drawLeftPaddleTwo();
}

export { draw, drawFour };
