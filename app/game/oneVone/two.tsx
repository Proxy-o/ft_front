"use client";

import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import useSurrenderGame from "../hooks/useSurrender";
import useGameSocket from "@/lib/hooks/useGameSocket"; // Make sure this is the correct path
import getCookie from "@/lib/functions/getCookie";
import { toast } from "sonner";
import useGetUser from "@/app/profile/hooks/useGetUser";
import CountDown from "../components/contDown";
import { User } from "@/lib/types";
import useGetGame from "../hooks/useGetGames";
import Score from "../components/score";
import { changeScoreOnline } from "../methods/changeScore";
import enemyLeftGame from "../methods/enemyLeftGame";
import { movePaddlesOnline } from "../methods/movePaddles";
import { checkLoseConditionOnline } from "../methods/checkLoseCondition";
import { changeBallDirectionOnline } from "../methods/changeBallDirection";
import { draw } from "../methods/draw";
import checkCollisionWithHorizontalWalls from "../methods/checkCollisionWithHorizontalWalls";
import { moveBall } from "../methods/moveBall";
import { canvasParams } from "../types";
import useEndGame from "../hooks/useEndGame";
import useLeaveGame from "../hooks/useLeaveGame";

const Two = ({ type }: { type: string }) => {
  const user_id = getCookie("user_id") || "";
  const { data: user } = useGetUser(user_id || "0");
  const username = user?.username || "";
  const [startCountdown, setStartCountdown] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameAccepted, setGameAccepted] = useState(false);
  const PaddleRightYRef = useRef(0);
  const paddleLeftYRef = useRef(0);
  const newBallPositionRef = useRef({ x: 0, y: 0 }); // Use a ref to store the current state
  const newAngleRef = useRef(0); // Use a ref to store the current state
  const { mutate: surrenderGame } = useSurrenderGame();
  const { mutate: leaveGame } = useLeaveGame();
  const { mutate: endGame } = useEndGame();
  const isFirstTime = useRef(true);
  const animationFrameId = useRef(0);
  const isAnimating = useRef(false);
  const isEnemyReadyRef = useRef(false);
  const {
    newNotif,
    handleStartGame,
    handleSurrender,
    handleMovePaddle,
    handleChangeBallDirection,
    handleEnemyScore,
  } = useGameSocket();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [leftScore, setLeftScore] = useState(0);
  const leftScoreRef = useRef(0);
  const [rightScore, setRightScore] = useState(0);
  const rightScoreRef = useRef(0);
  //game logic
  const { onGoingGame } = useGetGame(user_id || "0", type);

  // if (onGoingGame.isSuccess && onGoingGame.data !== null) {
  //     setStartGame(true);
  // }

  const rightUser: User | undefined =
    onGoingGame?.data?.game?.user1?.username === username
      ? onGoingGame?.data?.game?.user2
      : onGoingGame?.data?.game?.user1;
  const leftUser: User | undefined =
    onGoingGame?.data?.game?.user1?.username === username
      ? onGoingGame?.data?.game?.user1
      : onGoingGame?.data?.game?.user2;
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Exit if canvas is not available

    const ctx = canvas.getContext("2d");
    if (!ctx) return; // Exit if context is not available

    rightScoreRef.current = 0;
    leftScoreRef.current = 0;
    setLeftScore(0);
    setRightScore(0);

    let ballInLeftPaddle = false;

    let ballRadius = 10;
    let x = canvas.width / 2;
    let y = canvas.height / 2;

    isFirstTime.current = true;

    if (leftUser?.username === onGoingGame.data?.game?.user1?.username) {
      y = Math.random() * (canvas.height - ballRadius * 2) + ballRadius;
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
      let enemyAngle = Math.PI - newAngleRef.current;
      handleChangeBallDirection(
        newBallPositionRef.current.x,
        newBallPositionRef.current.y,
        enemyAngle,
        rightUser?.username || ""
      );
    }

    const paddleHeight = 80;
    const paddleWidth = 10;

    paddleLeftYRef.current = (canvas.height - paddleHeight) / 2;
    PaddleRightYRef.current = (canvas.height - paddleHeight) / 2;

    const paddleLeftX = 25;
    const paddleRightX = canvas.width - 25 - paddleWidth;
    let upPressed = false;
    let downPressed = false;

    const handleKeyEvent = (e: KeyboardEvent) => {
      if (e.type === "keydown") {
        if (e.key === "ArrowUp") {
          upPressed = true;
        } else if (e.key === "ArrowDown") {
          downPressed = true;
        }
      } else if (e.type === "keyup") {
        if (e.key === "ArrowUp") {
          upPressed = false;
        } else if (e.key === "ArrowDown") {
          downPressed = false;
        }
      }
    };

    document.addEventListener("keydown", handleKeyEvent, false);
    document.addEventListener("keyup", handleKeyEvent, false);

    // Cleanup function to remove the event listeners and stop the animation loop
    function returnFunction() {
      document.removeEventListener("keydown", handleKeyEvent, false);
      document.removeEventListener("keyup", handleKeyEvent, false);

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      isAnimating.current = false;
    }

    const drawOnlineOne = () => {
      if (canvas === null) return;
      if (!gameAccepted) return;
      const canvasParams: canvasParams = {
        canvas,
        ctx,
        paddleLeftYRef,
        paddleRightX,
        PaddleRightYRef,
        newBallPositionRef,
        paddleLeftX,
        paddleWidth,
        paddleHeight,
        ballRadius,
        upPressed,
        downPressed,
        isFirstTime,
        rightScoreRef,
      };
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // draw paddles and ball
      draw(canvasParams);

      // move paddles
      movePaddlesOnline(canvasParams, handleMovePaddle, rightUser);

      // Check for collision with left paddle
      changeBallDirectionOnline(
        canvasParams,
        newAngleRef,
        ballInLeftPaddle,
        handleChangeBallDirection,
        rightUser
      );

      // Check for score
      checkLoseConditionOnline(
        canvas,
        leftScoreRef,
        rightScoreRef,
        setGameAccepted,
        setGameStarted,
        setStartCountdown,
        leftUser,
        rightUser,
        onGoingGame,
        handleSurrender,
        endGame
      );

      // Change score
      changeScoreOnline(
        canvasParams,
        setRightScore,
        newAngleRef,
        handleChangeBallDirection,
        handleEnemyScore,
        rightUser
      );

      // Check for collision with the horizontal walls
      checkCollisionWithHorizontalWalls(
        canvas,
        ballRadius,
        newBallPositionRef,
        newAngleRef
      );

      // Move the ball
      moveBall(canvasParams, user, leftUser, newAngleRef);

      // Check if enemy has left the game
      enemyLeftGame(
        leftUser,
        rightUser,
        onGoingGame,
        newBallPositionRef,
        handleSurrender,
        canvas,
        setGameAccepted,
        setGameStarted,
        setStartCountdown,
        endGame
      );
    };

    const animate = () => {
      if (canvas === null) return;
      if (!gameStarted) return; // Exit if game is not started

      drawOnlineOne();
      animationFrameId.current = requestAnimationFrame(animate);
    };

    if (!isAnimating.current) {
      isAnimating.current = true;
      animate();
    }

    return returnFunction;
  }, [gameStarted]);

  useEffect(() => {
    const notif = newNotif();
    if (notif) {
      const parsedMessage = JSON.parse(notif.data);
      // toast.info(parsedMessage?.message);
      const message = parsedMessage?.message.split(" ");
      if (message[0] === "/show") {
        handleStartGame(username, message[1]);
        isEnemyReadyRef.current = true;
        setStartCountdown(true);
      } else if (message[0] === "/start") {
        onGoingGame.refetch();
      } else if (message[0] === "/move") {
        PaddleRightYRef.current = parseInt(message[1]);
      } else if (message[0] === "/ballDirection") {
        newBallPositionRef.current = {
          x: parseInt(message[1]),
          y: parseInt(message[2]),
        };
        if (newAngleRef.current !== 0) {
          isFirstTime.current = false;
        }
        newAngleRef.current = parseFloat(message[3]);
      } else if (message[0] === "/score") {
        isFirstTime.current = true;
        setLeftScore(parseInt(message[1]));
        leftScoreRef.current = parseInt(message[1]);
      } else if (message[0] === "/end") {
        setGameAccepted(false);
        setGameStarted(false);
        setStartCountdown(false);
        onGoingGame.refetch();
      }
    }
  }, [newNotif()?.data]);

  useEffect(() => {
    if (
      onGoingGame.isSuccess &&
      onGoingGame.data !== null &&
      leftUser?.username === username
    ) {
      setGameAccepted(true);
    } else {
      setGameAccepted(false);
    }
  }, [onGoingGame.isSuccess, onGoingGame.isLoading, onGoingGame.data]);

  return (
    <div className="w-full h-fit flex flex-col justify-center items-center">
      <h1 className="text-4xl">Ping Pong</h1>
      {gameAccepted && (
        <>
          <h1 className="text-2xl">
            Game {onGoingGame.data?.game?.game_number}
          </h1>
          <h1 className="text-2xl">
            {leftUser?.username} vs {rightUser?.username}
          </h1>
          <br />
          {onGoingGame.isSuccess && gameStarted && (
            <Score leftPlayerScore={leftScore} rightPlayerScore={rightScore} />
          )}
          {startCountdown && !gameStarted && (
            <CountDown
              setGameStarted={setGameStarted}
              setStartCountdown={setStartCountdown}
            />
          )}
          {onGoingGame.isSuccess && gameStarted && (
            <div className="w-full h-fit">
              <canvas
                ref={canvasRef}
                height="400"
                width="800"
                className="w-full md:w-5/6 h-[400px] lg:h-[500px] max-w-[800px] bg-black border-2 border-white mx-auto"
              ></canvas>
            </div>
          )}
          {onGoingGame.isSuccess && !gameStarted && (
            <div className="w-full h-fit flex flex-row justify-center items-center gap-4">
              <Button
                onClick={async () => {
                  handleStartGame(username, rightUser?.username || "");
                  setTimeout(() => {
                    if (!isEnemyReadyRef.current) {
                      toast.error("The enemy is not ready");
                    }
                  }, 1000);
                }}
                className="w-1/4 mt-4"
              >
                Start Game
              </Button>
              <Button
                onClick={() => {
                  leaveGame();
                }}
                className="w-1/4 mt-4"
              >
                Leave Game
              </Button>
            </div>
          )}
          {onGoingGame.isSuccess && gameStarted && (
            <Button
              onClick={() => {
                surrenderGame();
                handleSurrender(
                  onGoingGame.data?.game?.user1.username || "",
                  onGoingGame.data?.game?.user2.username || "",
                  onGoingGame.data?.game?.id || ""
                );
                setGameAccepted(false);
                setGameStarted(false);
                setStartCountdown(false);
              }}
              className="w-1/2 mt-4"
            >
              Surrender
            </Button>
          )}
          {!onGoingGame.isSuccess && !gameStarted && (
            <h1 className="text-4xl">No game found</h1>
          )}
          {onGoingGame.isLoading && (
            <h1 className="text-4xl">Waiting for the game to start</h1>
          )}
        </>
      )}
    </div>
  );
};

export default Two;
