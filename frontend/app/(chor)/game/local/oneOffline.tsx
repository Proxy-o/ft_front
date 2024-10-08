"use client";

import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import NoGame from "../components/noGame";
import Score from "../oneVone/components/score";

const OneOffline = ({
  gameStarted,
  setGameStarted,
  leftScore,
  rightScore,
  setLeftScore,
  setRightScore,
  type,
}: {
  gameStarted: boolean;
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
  leftScore: number;
  rightScore: number;
  setLeftScore: React.Dispatch<React.SetStateAction<number>>;
  setRightScore: React.Dispatch<React.SetStateAction<number>>;
  type: "game" | "tournament";
}) => {
  const newBallPositionRef = useRef({ x: 0, y: 0 }); // Use a ref to store the current state
  const newAngleRef = useRef(0); // Use a ref to store the current state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef(0); // To keep track of the animation frame ID
  const isAnimating = useRef(false);
  const state = useRef<string>("local");
  const ai = useRef<boolean>(false);

  let bgImage = new Image();
  bgImage.src = "/game.jpeg";

  useEffect(() => {
    if (!gameStarted) return; // Exit if game is not started
    const canvas = canvasRef.current;
    if (!canvas) return; // Exit if canvas is not available

    const ctx = canvas.getContext("2d");
    if (!ctx) return; // Exit if context is not available

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
    const paddleWidth = 15;
    let paddleRightY = (canvas.height - paddleHeight) / 2;
    let paddleLeftY = (canvas.height - paddleHeight) / 2;

    const paddleLeftX = 0;
    const paddleRightX = canvas.width - paddleWidth;

    let upPressed = false;
    let downPressed = false;
    let wPressed = false;
    let sPressed = false;

    const handleKeyEvent = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
      }
      if (e.type === "keydown") {
        if (e.key === "ArrowUp") {
          upPressed = true;
        } else if (e.key === "ArrowDown") {
          downPressed = true;
        } else if (e.key === "w" && !ai.current) {
          wPressed = true;
        } else if (e.key === "s" && !ai.current) {
          sPressed = true;
        }
      } else if (e.type === "keyup") {
        if (e.key === "ArrowUp") {
          upPressed = false;
        } else if (e.key === "ArrowDown") {
          downPressed = false;
        } else if (e.key === "w" && !ai.current) {
          wPressed = false;
        } else if (e.key === "s" && !ai.current) {
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
        if (!ai.current) {
          if (paddleRightY - 12 > 0) {
            paddleRightY -= 12; // Move right paddle up
          } else {
            paddleRightY = 0;
          }
        } else {
          if (paddleLeftY - 12 > 0) {
            paddleLeftY -= 12; // Move left paddle down
          } else {
            paddleLeftY = 0;
          }
        }
      }
      if (downPressed) {
        if (!ai.current) {
          if (paddleRightY + paddleHeight + 12 < canvas.height) {
            paddleRightY += 12; // Move right paddle down
          } else {
            paddleRightY = canvas.height - paddleHeight;
          }
        } else {
          if (paddleLeftY + paddleHeight + 12 < canvas.height) {
            paddleLeftY += 12; // Move left paddle up
          } else {
            paddleLeftY = canvas.height - paddleHeight;
          }
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
          setRightScore(rightScore + 1);
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
          setLeftScore(leftScore + 1);
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
      if (leftScore === 77777) {
        state.current = "left";
      } else if (rightScore === 77777) {
        state.current = "right";
      }
      if (leftScore === 77777 || rightScore === 77777) {
        setRightScore(0);
        setLeftScore(0);
        setGameStarted(false);
      }
    }

    const gameNotStarted = () => {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0.5;
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
    };

    const drawOfflineOne = () => {
      if (canvas === null) return;
      if (!gameStarted) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the background
      gameNotStarted();
      // drawScore();
      drawBall();
      drawRightPaddle();
      drawLeftPaddle();

      if (ai.current) {
        if (newBallPositionRef.current.y < paddleRightY + paddleHeight / 8) {
          if (paddleRightY - 12 > 0) {
            paddleRightY -= 3; // Move right paddle up
          } else {
            paddleRightY = 0;
          }
        } else if (
          newBallPositionRef.current.y >
          paddleRightY + (paddleHeight * 7) / 8
        ) {
          if (paddleRightY + paddleHeight + 12 < canvas.height) {
            paddleRightY += 3; // Move right paddle down
          } else {
            paddleRightY = canvas.height - paddleHeight;
          }
        }
      }

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
  }, [gameStarted, bgImage]);

  return (
    <>
      {gameStarted && type === "game" && (
        <Score leftScore={leftScore} rightScore={rightScore} />
      )}
      <Card className="w-full aspect-[2]">
        {gameStarted ? (
          <canvas
            ref={canvasRef}
            height="400"
            width="800"
            className="w-full h-full"
          ></canvas>
        ) : (
          <div className="flex flex-col items-center w-full h-full">
            <NoGame state={state} />
          </div>
        )}
      </Card>
      {gameStarted ? (
        type === "game" && (
        <Button
          onClick={() => {
            setLeftScore(0);
            setRightScore(0);
            setGameStarted(false);
          }}
          className="w-1/3 mx-auto bg-red-500/25"
        >
          End Game
        </Button>
        )
      ) : (
        <Button
          onClick={() => {
            setGameStarted(true);
          }}
          className="w-1/3 mx-auto h-10 p-3 bg-green-500/25"
        >
          Start Game
        </Button>
      )}
    </>
  );
};

export default OneOffline;
