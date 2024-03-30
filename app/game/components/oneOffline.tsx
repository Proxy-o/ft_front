import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CountDown from "./contDown";
import Score from "./score";

const OneOffline = () => {
  const [startCountdown, setStartCountdown] = useState(false);
  const newBallPositionRef = useRef({ x: 0, y: 0 }); // Use a ref to store the current state
  const newAngleRef = useRef(0); // Use a ref to store the current state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [leftScore, setLeftScore] = useState(0);
  const leftScoreRef = useRef(0);
  const [rightScore, setRightScore] = useState(0);
  const rightScoreRef = useRef(0);
  const animationFrameId = useRef(0); // To keep track of the animation frame ID
  const isAnimating = useRef(false);

  useEffect(() => {
    if (!gameStarted) return; // Exit if game is not started
    const canvas = canvasRef.current;
    if (!canvas) return; // Exit if canvas is not available

    const ctx = canvas.getContext("2d");
    if (!ctx) return; // Exit if context is not available

    rightScoreRef.current = 0;
    leftScoreRef.current = 0;
    setLeftScore(0);
    setRightScore(0);

    let firstTime = true;

    let ballInLeftPaddle = false;
    let ballInRightPaddle = false;

    let ballRadius = 10;
    let x = canvas.width / 2;
    let y = Math.random() * (canvas.height - ballRadius * 2) + ballRadius;
    newBallPositionRef.current = { x, y }; // Initialize the ref

    newAngleRef.current = Math.random() * Math.PI;
    while (
      (newAngleRef.current > Math.PI / 6 &&
        newAngleRef.current < (Math.PI * 5) / 6) ||
      (newAngleRef.current > (Math.PI * 7) / 6 &&
        newAngleRef.current < (Math.PI * 11) / 6)
    ) {
      newAngleRef.current = Math.random() * 2 * Math.PI;
    }

    const paddleHeight = 60;
    const paddleWidth = 10;
    let paddleRightY = (canvas.height - paddleHeight) / 2;
    let paddleLeftY = (canvas.height - paddleHeight) / 2;

    const paddleLeftX = 20;
    const paddleRightX = canvas.width - 15 - paddleWidth;

    let upPressed = false;
    let downPressed = false;
    let wPressed = false;
    let sPressed = false;

    const handleKeyEvent = (e: KeyboardEvent) => {
      if (e.type === "keydown") {
        if (e.key === "ArrowUp") {
          upPressed = true;
        } else if (e.key === "ArrowDown") {
          downPressed = true;
        } else if (e.key === "w") {
          wPressed = true;
        } else if (e.key === "s") {
          sPressed = true;
        }
      } else if (e.type === "keyup") {
        if (e.key === "ArrowUp") {
          upPressed = false;
        } else if (e.key === "ArrowDown") {
          downPressed = false;
        } else if (e.key === "w") {
          wPressed = false;
        } else if (e.key === "s") {
          sPressed = false;
        }
      }
    };

    // Add the event listener for both keydown and keyup events
    document.addEventListener("keydown", handleKeyEvent, false);
    document.addEventListener("keyup", handleKeyEvent, false);

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
      ctx.rect(paddleRightX, paddleRightY, paddleWidth, paddleHeight);
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
    };

    const drawLeftPaddle = () => {
      ctx.beginPath();
      ctx.rect(paddleLeftX, paddleLeftY, paddleWidth, paddleHeight);
      ctx.fillStyle = "#ee95DD";
      ctx.fill();
      ctx.closePath();
    };

    function checkCollisionWithHorizontalWalls() {
      if (canvas === null) return;
      if (
        newBallPositionRef.current.y > canvas.height - ballRadius ||
        newBallPositionRef.current.y < ballRadius
      ) {
        newAngleRef.current = -newAngleRef.current;
      }
    }

    function moveBall() {
      if (firstTime) {
        newBallPositionRef.current.x += Math.cos(newAngleRef.current) * 3;
        newBallPositionRef.current.y += Math.sin(newAngleRef.current) * 3;
      } else {
        newBallPositionRef.current.x += Math.cos(newAngleRef.current) * 8;
        newBallPositionRef.current.y += Math.sin(newAngleRef.current) * 8;
      }
    }

    // 1 vs 1 offline -------------------------------------------------------------------------------------
    function changeBallDirectionOffline() {
      if (canvas === null) return;
      if (
        newBallPositionRef.current.x < paddleLeftX + paddleWidth + ballRadius &&
        newBallPositionRef.current.x > paddleLeftX + ballRadius &&
        newBallPositionRef.current.y + ballRadius / 2 > paddleLeftY &&
        newBallPositionRef.current.y - ballRadius / 2 <
          paddleLeftY + paddleHeight
      ) {
        firstTime = false;
        if (!ballInLeftPaddle) {
          let ballPositionOnPaddle = newBallPositionRef.current.y - paddleLeftY;
          let ballPercentageOnPaddle = ballPositionOnPaddle / paddleHeight;
          if (newBallPositionRef.current.y < paddleLeftY + paddleHeight / 2) {
            newAngleRef.current =
              ((-Math.PI * 2) / 6) * (0.5 - ballPercentageOnPaddle);
          } else {
            newAngleRef.current =
              ((Math.PI * 2) / 6) * (ballPercentageOnPaddle - 0.5);
          }
          ballInLeftPaddle = true;
        }
      } else {
        ballInLeftPaddle = false;
      }

      if (
        newBallPositionRef.current.x > paddleRightX - ballRadius &&
        newBallPositionRef.current.x <
          paddleRightX + paddleWidth + ballRadius &&
        newBallPositionRef.current.y + ballRadius / 2 > paddleRightY &&
        newBallPositionRef.current.y - ballRadius / 2 <
          paddleRightY + paddleHeight
      ) {
        firstTime = false;
        if (!ballInRightPaddle) {
          let ballPositionOnPaddle =
            newBallPositionRef.current.y - paddleRightY;
          let ballPercentageOnPaddle = ballPositionOnPaddle / paddleHeight;
          if (newBallPositionRef.current.y < paddleRightY + paddleHeight / 2) {
            newAngleRef.current =
              -Math.PI + ((Math.PI * 2) / 6) * (0.5 - ballPercentageOnPaddle);
          } else {
            newAngleRef.current =
              Math.PI - ((Math.PI * 2) / 6) * (ballPercentageOnPaddle - 0.5);
          }
          ballInRightPaddle = true;
        }
      } else {
        ballInRightPaddle = false;
      }
    }

    function movePaddlesOffline() {
      if (canvas === null) return;
      if (upPressed) {
        if (paddleRightY - 12 > 0) {
          paddleRightY -= 12; // Move right paddle up
        } else {
          paddleRightY = 0;
        }
      }
      if (downPressed) {
        if (paddleRightY + paddleHeight + 12 < canvas.height) {
          paddleRightY += 12; // Move right paddle down
        } else {
          paddleRightY = canvas.height - paddleHeight;
        }
      }
      if (wPressed) {
        if (paddleLeftY - 12 > 0) {
          paddleLeftY -= 12; // Move left paddle down
        } else {
          paddleLeftY = 0;
        }
      }
      if (sPressed) {
        if (paddleLeftY + paddleHeight + 12 < canvas.height) {
          paddleLeftY += 12; // Move left paddle up
        } else {
          paddleLeftY = canvas.height - paddleHeight;
        }
      }
    }

    function changeScoreOffline() {
      if (canvas === null) return;
      if (newBallPositionRef.current.x < 0) {
        if (newBallPositionRef.current.x < -50) {
          rightScoreRef.current = rightScoreRef.current + 1;
          setRightScore(rightScoreRef.current);
          x = canvas.width / 2;
          y = Math.random() * (canvas.height - ballRadius * 2) + ballRadius;
          firstTime = true;
          newBallPositionRef.current = { x, y };
          newAngleRef.current = Math.random() * 2 * Math.PI;
          while (
            (newAngleRef.current > Math.PI / 6 &&
              newAngleRef.current < (Math.PI * 5) / 6) ||
            (newAngleRef.current > (Math.PI * 7) / 6 &&
              newAngleRef.current < (Math.PI * 11) / 6)
          ) {
            newAngleRef.current = Math.random() * 2 * Math.PI;
          }
        }
      } else if (newBallPositionRef.current.x > canvas.width) {
        if (newBallPositionRef.current.x > canvas.width + 50) {
          leftScoreRef.current = leftScoreRef.current + 1;
          setLeftScore(leftScoreRef.current);
          x = canvas.width / 2;
          y = Math.random() * (canvas.height - ballRadius * 2) + ballRadius;
          firstTime = true;
          newBallPositionRef.current = { x, y };
          newAngleRef.current = Math.random() * 2 * Math.PI;
          while (
            (newAngleRef.current > Math.PI / 6 &&
              newAngleRef.current < (Math.PI * 5) / 6) ||
            (newAngleRef.current > (Math.PI * 7) / 6 &&
              newAngleRef.current < (Math.PI * 11) / 6)
          ) {
            newAngleRef.current = Math.random() * 2 * Math.PI;
          }
        }
      }
    }
    function checkLoseConditionOffline() {
      if (canvas === null) return;
      if (leftScoreRef.current === 10 || rightScoreRef.current === 10) {
        rightScoreRef.current = 0;
        leftScoreRef.current = 0;
        setGameStarted(false);
        setStartCountdown(false);
        if (leftScoreRef.current === 10) {
          // alert("Left player wins!");
        } else if (rightScoreRef.current === 10) {
          // alert("Right player wins!");
        }
      }
    }

    const drawOfflineOne = () => {
      if (canvas === null) return;
      if (!gameStarted) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBall();
      drawRightPaddle();
      drawLeftPaddle();

      // Move paddles
      movePaddlesOffline();

      // Check for collision with left paddle
      changeBallDirectionOffline();

      // Check for score
      checkLoseConditionOffline();

      // Change score
      changeScoreOffline();

      // Check for collision with the horizontal walls
      checkCollisionWithHorizontalWalls();

      // Move the ball
      moveBall();
    };

    const animate = () => {
      if (canvas === null) return;
      if (!gameStarted) return; // Exit if game is not started

      drawOfflineOne();
      animationFrameId.current = requestAnimationFrame(animate);
    };

    if (!isAnimating.current) {
      isAnimating.current = true;
      animate();
    }

    return () => {
      // Cleanup function to remove the event listeners and stop the animation loop
      document.removeEventListener("keydown", handleKeyEvent, false);
      document.removeEventListener("keyup", handleKeyEvent, false);

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      isAnimating.current = false;
    };
  }, [gameStarted]);

  return (
    <div className="w-full h-fit flex flex-col justify-center items-center text-white">
      <h1 className="text-4xl">Ping Pong</h1>
      <br />
      <Score leftPlayerScore={leftScore} rightPlayerScore={rightScore} />

      {startCountdown ? (
        gameStarted ? (
          <>
            <div className="border-2 border-white w-fit h-fit">
              <canvas ref={canvasRef} width="512" height="400"></canvas>
            </div>
          </>
        ) : (
          <CountDown
            setGameStarted={setGameStarted}
            setStartCountdown={setStartCountdown}
          />
        )
      ) : (
        <Button
          onClick={() => {
            setStartCountdown(true);
          }}
          className="w-1/2 mt-4"
        >
          Start Game
        </Button>
      )}
    </div>
  );
};

export default OneOffline;
