import React, { useRef, useEffect, useState, use } from "react";
import { Button } from "@/components/ui/button";
import useSurrenderGame from "../hooks/useSurrender";
import useGameSocket from "@/lib/hooks/useGameSocket"; // Make sure this is the correct path
import getCookie from "@/lib/functions/getCookie";
import { toast } from "sonner";
import useGetUser from "@/app/profile/hooks/useGetUser";
import CountDown from "./contDown";
import { User } from "@/lib/types";
import useGetGame from "../hooks/useGetGames";
import Score from "./score";

const OneOnline = () => {
  const user_id = getCookie("user_id") || "";
  const { data: user } = useGetUser(user_id || "0");
  const username = user?.username || "";
  const [startCountdown, setStartCountdown] = useState(false);
  const PaddleRightYRef = useRef(0); // Use a ref to store the current state
  const newBallPositionRef = useRef({ x: 0, y: 0 }); // Use a ref to store the current state
  const newAngleRef = useRef(0); // Use a ref to store the current state
  const leftPaddleOldY = useRef(0);
  const { mutate: surrenderGame } = useSurrenderGame();
  const {
    newNotif,
    handleStartGame,
    handleSurrender,
    handleMovePaddle,
    handleChangeBallDirection,
  } = useGameSocket();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [leftScore, setLeftScore] = useState(0);
  const leftScoreRef = useRef(0);
  const [rightScore, setRightScore] = useState(0);
  const rightScoreRef = useRef(0);
  //game logic
  const [gameStarted, setGameStarted] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const { onGoingGame } = useGetGame(user_id || "0");

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
    // console.log("onGoingGame in useEffect", onGoingGame);
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

    let ballRadius = 10;
    let x = canvas.width / 2;
    let y = Math.random() * (canvas.height - ballRadius * 2) + ballRadius;
    newBallPositionRef.current = { x, y }; // Initialize the ref

    newAngleRef.current =
      Math.random() * Math.PI * (Math.random() > 0.5 ? 1 : -1);

    if (leftUser?.username === onGoingGame.data?.game?.user1?.username) {
      newAngleRef.current = Math.random() * Math.PI;
      while (
        (newAngleRef.current > Math.PI / 6 &&
          newAngleRef.current < (Math.PI * 5) / 6) ||
        (newAngleRef.current > (Math.PI * 7) / 6 &&
          newAngleRef.current < (Math.PI * 11) / 6)
      ) {
        newAngleRef.current = Math.random() * 2 * Math.PI;
      }
      handleChangeBallDirection(
        x,
        y,
        Math.PI - newAngleRef.current,
        rightUser?.username || ""
      );
    }

    const paddleHeight = 60;
    const paddleWidth = 10;
    let paddleRightY = (canvas.height - paddleHeight) / 2;
    let paddleLeftY = (canvas.height - paddleHeight) / 2;

    PaddleRightYRef.current = paddleRightY; // Initialize the ref
    leftPaddleOldY.current = paddleLeftY;

    const paddleLeftX = 20;
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
        canvas.width - paddleWidth,
        PaddleRightYRef.current,
        paddleWidth,
        paddleHeight
      );
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
    };

    const drawLeftPaddle = () => {
      ctx.beginPath();
      ctx.rect(0, paddleLeftY, paddleWidth, paddleHeight);
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
        if (user?.username === leftUser?.username)
          newBallPositionRef.current.x += Math.cos(newAngleRef.current) * 3;
        else newBallPositionRef.current.x -= Math.cos(newAngleRef.current) * 3;
        newBallPositionRef.current.y += Math.sin(newAngleRef.current) * 3;
      } else {
        if (user?.username === leftUser?.username)
          newBallPositionRef.current.x += Math.cos(newAngleRef.current) * 8;
        else newBallPositionRef.current.x -= Math.cos(newAngleRef.current) * 8;
        newBallPositionRef.current.y += Math.sin(newAngleRef.current) * 8;
      }
    }

    // 1 vs 1 online -------------------------------------------------------------------------------------
    function changeBallDirectionOnline() {
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
          let enemyX = canvas.width - newBallPositionRef.current.x;
          let enemyY = newBallPositionRef.current.y;
          let enemyAngle = Math.PI - newAngleRef.current;
          handleChangeBallDirection(
            enemyX,
            enemyY,
            enemyAngle,
            rightUser?.username || ""
          );
          ballInLeftPaddle = true;
        }
      } else {
        ballInLeftPaddle = false;
      }
    }

    function movePaddlesOnline() {
      if (canvas === null) return;
      if (upPressed && paddleLeftY > 0) {
        if (paddleLeftY - 20 < 0) {
          paddleLeftY = 0;
        } else {
          paddleLeftY -= 20;
        }
        handleMovePaddle(paddleLeftY, rightUser?.username || "");
      } else if (downPressed && paddleLeftY < canvas.height - paddleHeight) {
        if (paddleLeftY + 20 > canvas.height - paddleHeight) {
          paddleLeftY = canvas.height - paddleHeight;
        } else {
          paddleLeftY += 20;
        }
        handleMovePaddle(paddleLeftY, rightUser?.username || "");
      }
      upPressed = false;
      downPressed = false;
    }

    const drawOnlineOne = () => {
      console.log("drawOnlineOne");
      if (canvas === null) return;
      console.log("is not null");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBall();
      drawRightPaddle();
      drawLeftPaddle();

      // move paddles
      movePaddlesOnline();

      // Check for collision with left paddle
      changeBallDirectionOnline();

      // Check for collision with the horizontal walls
      checkCollisionWithHorizontalWalls();

      // Move the ball
      moveBall();
    };

    const animate = () => {
      if (canvas === null) return;
      drawOnlineOne();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      document.removeEventListener("keydown", handleKeyEvent);
    };
  }, [gameStarted]);

  useEffect(() => {
    const notif = newNotif();
    if (notif) {
      const message = JSON.parse(notif.data);
      if (message.message?.split(" ")[0] === "/show") {
        setStartCountdown(true);
        onGoingGame.refetch();
      } else if (message.message?.split(" ")[0] === "/start") {
        // invitaionsData.refetch();
        onGoingGame.refetch();
        // setStartCountdown(true);
      } else if (message.message?.split(" ")[0] === "/end") {
        setStartGame(false);
        setGameStarted(false);
        setStartCountdown(false);
        onGoingGame.refetch();
        if (message.message?.split(" ")[1] === username) {
          toast.error("You have lost the game");
        }
        if (message.message?.split(" ")[2] === username) {
          toast.success("You have won the game");
        }
      } else if (message.message?.split(" ")[0] === "/move") {
        PaddleRightYRef.current = parseInt(message.message.split(" ")[1]); // Update the ref
      } else if (message.message?.split(" ")[0] === "/ballDirection") {
        newBallPositionRef.current = {
          x: parseInt(message.message.split(" ")[1]),
          y: parseInt(message.message.split(" ")[2]),
        }; // Update the ref
        newAngleRef.current = parseFloat(message.message.split(" ")[3]); // Update the ref
      }
      console.log("message", message);
    }
  }, [newNotif()?.data]);

  useEffect(() => {
    if (
      onGoingGame.isSuccess &&
      onGoingGame.data !== null &&
      leftUser?.username === username
    ) {
      setStartGame(true);
    } else {
      setStartGame(false);
    }
  }, [onGoingGame.isSuccess]);

  return (
    <div className="w-fit h-fit flex flex-col justify-center items-center text-white">
      {startGame && (
        <>
          <h1 className="text-4xl">Ping Pong</h1>
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
            <div className="border-2 border-white w-fit h-fit">
              <canvas ref={canvasRef} width="512" height="400"></canvas>
            </div>
          )}
          {onGoingGame.isSuccess && !gameStarted && (
            <Button
              onClick={() => {
                handleStartGame(
                  onGoingGame.data?.game?.user1.username || "",
                  onGoingGame.data?.game?.user2.username || ""
                );
                setStartCountdown(true);
              }}
              className="w-1/2 mt-4"
            >
              Start Game
            </Button>
          )}
          {onGoingGame.isSuccess && gameStarted && (
            <Button
              onClick={() => {
                surrenderGame();
                handleSurrender(
                  onGoingGame.data?.game?.user1.username || "",
                  onGoingGame.data?.game?.user2.username || ""
                );
                onGoingGame.refetch();
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

export default OneOnline;
