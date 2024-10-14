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
    ctx.fillStyle = "#FFFFFF";
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

  // drawPlayer();
  // drawMiddleLine();
  // drawScore();
  drawBall();
  drawRightPaddle();
  drawLeftPaddle();
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

  // drawScore();
  // drawMiddleLine();
  drawBall();
  drawRightPaddle();
  drawLeftPaddle();
  drawRightPaddleTwo();
  drawLeftPaddleTwo();
}

const drawPlayers = (
  canvasParams: canvasParams,
  leftUser: React.MutableRefObject<any>,
  rightUser: React.MutableRefObject<any>,
  leftImageRef: React.MutableRefObject<CanvasImageSource | null>,
  rightImageRef: React.MutableRefObject<CanvasImageSource | null>,
  leftPositionRef: React.MutableRefObject<number>,
  rightPositionRef: React.MutableRefObject<number>,
  ctx: CanvasRenderingContext2D
) => {
  const { canvas } = canvasParams;
  if (canvas === null) return;
  if (leftImageRef.current === null) return;
  if (leftUser.current === undefined) return;
  // italic and bold
  if (leftPositionRef.current < 100) leftPositionRef.current += 20;
  // // console.log(userRef.current?.username);
  ctx.fillStyle = "#ee95DD";
  ctx.font = "50px bold";
  ctx.fillText(
    leftUser.current?.username || "",
    leftPositionRef.current + 70,
    50
  );
  ctx.save();
  ctx.beginPath();
  ctx.arc(
    leftPositionRef.current + 100,
    canvas.height / 2,
    100,
    0,
    Math.PI * 2
  );
  ctx.closePath();
  ctx.clip();

  // Draw the image inside the clipped path
  ctx.drawImage(
    leftImageRef.current,
    leftPositionRef.current,
    canvas.height / 2 - 100,
    200,
    200
  );

  // Restore the context state after clipping
  ctx.restore();

  if (rightImageRef.current === null) return;
  if (rightPositionRef.current > canvas.width / 2 + 100)
    rightPositionRef.current -= 20;

  ctx.fillText(
    rightUser.current?.username || "",
    rightPositionRef.current + 70,
    50
  );
  ctx.save();
  ctx.beginPath();
  ctx.arc(
    rightPositionRef.current + 100,
    canvas.height / 2,
    100,
    0,
    Math.PI * 2
  );
  ctx.closePath();
  ctx.clip();

  // Draw the image inside the clipped path
  ctx.drawImage(
    rightImageRef.current,
    rightPositionRef.current,
    canvas.height / 2 - 100,
    200,
    200
  );

  // Restore the context state after clipping
  ctx.restore();
};
export { draw, drawFour, drawPlayers };
