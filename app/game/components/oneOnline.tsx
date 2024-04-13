import React, { useRef, useEffect, useState } from "react";
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
  const [gameStarted, setGameStarted] = useState(false);
  const [gameAccepted, setGameAccepted] = useState(false);
  const PaddleRightYRef = useRef(0); // Use a ref to store the current state
  const newBallPositionRef = useRef({ x: 0, y: 0 }); // Use a ref to store the current state
  const newAngleRef = useRef(0); // Use a ref to store the current state
  const leftPaddleOldY = useRef(0);
  const { mutate: surrenderGame } = useSurrenderGame();
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
    let paddleRightY = (canvas.height - paddleHeight) / 2;
    let paddleLeftY = (canvas.height - paddleHeight) / 2;

    PaddleRightYRef.current = paddleRightY; // Initialize the ref
    leftPaddleOldY.current = paddleLeftY;

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
      if (isFirstTime.current == true) {
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
        isFirstTime.current = false;
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

    function changeScoreOnline() {
      if (canvas === null) return;
      if (newBallPositionRef.current.x < -50) {
        isFirstTime.current = true;
        rightScoreRef.current = rightScoreRef.current + 1;
        setRightScore(rightScoreRef.current);
        newBallPositionRef.current.x = canvas.width / 2;
        newAngleRef.current = Math.random() * 2 * Math.PI;
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
        handleEnemyScore(rightScoreRef.current, rightUser?.username || "");
      }
    }

    function checkLoseConditionOnline() {
      if (canvas === null) return;
      if (rightScoreRef.current === 3) {
        setGameAccepted(false);
        setGameStarted(false);
        setStartCountdown(false);
        handleSurrender(
          leftUser?.username || "",
          rightUser?.username || "",
          onGoingGame.data?.game?.id || ""
        );
        toast.error("You have lost the game");
      }
    }

    function movePaddlesOnline() {
      if (canvas === null) return;
      if (upPressed && paddleLeftY > 0) {
        if (paddleLeftY - 6 < 0) {
          paddleLeftY = 0;
        } else {
          paddleLeftY -= 6;
        }
        handleMovePaddle(paddleLeftY, rightUser?.username || "");
      } else if (downPressed && paddleLeftY < canvas.height - paddleHeight) {
        if (paddleLeftY + 6 > canvas.height - paddleHeight) {
          paddleLeftY = canvas.height - paddleHeight;
        } else {
          paddleLeftY += 6;
        }
        handleMovePaddle(paddleLeftY, rightUser?.username || "");
      }
    }

    // Cleanup function to remove the event listeners and stop the animation loop
    function returnFunction() {
      document.removeEventListener("keydown", handleKeyEvent, false);
      document.removeEventListener("keyup", handleKeyEvent, false);

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      isAnimating.current = false;
    }

    function enemyLeftGame() {
      if (canvas === null) return;
      if (newBallPositionRef.current.x > canvas.width + 500) {
        handleSurrender(
          leftUser?.username || "",
          rightUser?.username || "",
          onGoingGame.data?.game?.id || ""
        );
        setGameAccepted(false);
        setGameStarted(false);
        setStartCountdown(false);
        toast.success("You have won the game");
      }
    }

    const drawOnlineOne = () => {
      if (canvas === null) return;
      if (!gameAccepted) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBall();
      drawRightPaddle();
      drawLeftPaddle();

      // move paddles
      movePaddlesOnline();

      // Check for collision with left paddle
      changeBallDirectionOnline();

      // Check for score
      checkLoseConditionOnline();

      // Change score
      changeScoreOnline();

      // Check for collision with the horizontal walls
      checkCollisionWithHorizontalWalls();

      // Move the ball
      moveBall();

      // Check if enemy has left the game
      enemyLeftGame();
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
      const message = JSON.parse(notif.data);
      if (message.message?.split(" ")[0] === "/show") {
        handleStartGame(username, message.message.split(" ")[1]);
        isEnemyReadyRef.current = true;
        setStartCountdown(true);
        onGoingGame.refetch();
      } else if (message.message?.split(" ")[0] === "/start") {
        // invitaionsData.refetch();
        onGoingGame.refetch();
        isFirstTime.current = true;
        setGameAccepted(true);
        // setStartCountdown(true);
      } else if (message.message?.split(" ")[0] === "/score") {
        isFirstTime.current = true;
        setLeftScore(parseInt(message.message.split(" ")[1]));
        leftScoreRef.current = parseInt(message.message.split(" ")[1]);
      } else if (message.message?.split(" ")[0] === "/end") {
        console.log("game over");
        setGameAccepted(false);
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
        isFirstTime.current = false;
        newAngleRef.current = parseFloat(message.message.split(" ")[3]); // Update the ref
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
  }, [onGoingGame.isSuccess, onGoingGame.data]);

  return (
    <div className="w-full h-fit flex flex-col justify-center items-center">
      {gameAccepted && (
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
            <Button
              onClick={async () => {
                handleStartGame(username, rightUser?.username || "");
                setTimeout(() => {
                  if (!isEnemyReadyRef.current) {
                    toast.error("The enemy is not ready");
                  }
                }, 1000);
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

export default OneOnline;