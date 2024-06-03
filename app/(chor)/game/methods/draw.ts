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

  const drawPlayer = () => {
    if (canvas === null) return;
    ctx.font = "italic bold 50px Arial";
    ctx.fillStyle = "#0095DD";
    // ctx.fillText({ user }, canvas.width / 2 - 150, canvas.height / 2 - 20);
    ctx.fillText("Player", canvas.width / 2 + 150, canvas.height / 2 - 20);
  };

  // drawPlayer();
  drawMiddleLine();
  drawScore();
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

  drawScore();
  drawRightPaddleTwo();
  drawBall();
  drawMiddleLine();
  drawRightPaddle();
  drawLeftPaddle();
  drawLeftPaddleTwo();
}

const drawLeaveButton = (
  canvasParams: canvasParams,
  gameStartedRef: React.MutableRefObject<boolean>,
  ctx: CanvasRenderingContext2D
) => {
  const { canvas } = canvasParams;
  if (canvas === null) return;
  if (!gameStartedRef.current) {
    ctx.fillStyle = "#ee95DD";
    ctx.fillRect(50, canvas.height - 50, 100, 40);

    // Add text to the button
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Leave", 75, canvas.height - 23);
  }
};
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
  // console.log(userRef.current?.username);
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
const drawLightningBolt = (
  canvasParams: canvasParams,
  lightninigBoltYRef: React.MutableRefObject<number>,
  ctx: CanvasRenderingContext2D
) => {
  const { canvas } = canvasParams;
  if (canvas === null) return;
  // Move the lightning bolt up the canvas
  if (lightninigBoltYRef.current < 0) lightninigBoltYRef.current += 50;
  // Calculate the center of the canvas width
  const centerX = canvas.width / 2 - 50;
  const topY = lightninigBoltYRef.current;
  const bottomY = canvas.height;

  // Begin a new path
  ctx.beginPath();

  // Define the points for the lightning bolt shape
  ctx.moveTo(centerX + 20, topY); // Start at the top center

  // Define the zigzag points down the canvas
  ctx.lineTo(centerX + 100, topY); // First diagonal down
  ctx.lineTo(centerX + 95, topY + 120); // First diagonal up
  ctx.lineTo(centerX + 50, topY + 110); // Second diagonal down
  ctx.lineTo(centerX + 60, topY + 230);
  ctx.lineTo(centerX, topY + 220);
  ctx.lineTo(centerX + 20, topY + 340);
  ctx.lineTo(centerX - 40, topY + 190);
  ctx.lineTo(centerX + 20, topY + 200);
  ctx.lineTo(centerX - 20, topY + 70);
  ctx.lineTo(centerX + 40, topY + 80);
  // ctx.lineTo(centerX + 20, bottomY - 10); // Final diagonal to the bottom center
  // ctx.lineTo(centerX + 100, topY + 100);

  // Close the path
  ctx.closePath();

  // Set the fill color and fill the shape
  ctx.fillStyle = "yellow";
  ctx.fill();

  // Optionally, you can add a stroke to the bolt
  ctx.lineWidth = 3;
  ctx.strokeStyle = "orange";
  ctx.stroke();
};
const drawStartButton = (
  canvasParams: canvasParams,
  ctx: CanvasRenderingContext2D
) => {
  const { canvas } = canvasParams;
  if (canvas === null) return;
  ctx.fillStyle = "#ee95DD";
  ctx.fillRect(canvas.width - 150, canvas.height - 50, 100, 40);

  // Add text to the button
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Start", canvas.width - 125, canvas.height - 23);
};

const drawSurrenderButton = (
  canvasParams: canvasParams,
  gameStartedRef: React.MutableRefObject<boolean>,
  ctx: CanvasRenderingContext2D
) => {
  const { canvas } = canvasParams;
  if (canvas === null) return;
  if (gameStartedRef.current) {
    ctx.fillStyle = "#ee95DD";
    ctx.fillRect(canvas.width - 150, canvas.height - 50, 100, 40);

    // Add text to the button
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Surrender", canvas.width - 145, canvas.height - 23);
  }
};

export {
  draw,
  drawFour,
  drawLeaveButton,
  drawPlayers,
  drawLightningBolt,
  drawStartButton,
  drawSurrenderButton,
};
