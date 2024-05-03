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
import Score from "../components/score";
import useGetFourGame from "../hooks/useGetFourGame";
import useCreateGameFour from "../hooks/useCreateGameFour";
import Players from "../components/players";
import InviteFriends from "../components/inviteFriend";
import { Card } from "@/components/ui/card";
import { changeBallDirectionFour } from "../methods/changeBallDirection";
import { canvasParamsFour } from "../types";
import { checkLoseConditionFour } from "../methods/checkLoseCondition";
import { changeScoreFour } from "../methods/changeScore";
import checkCollisionWithHorizontalWalls from "../methods/checkCollisionWithHorizontalWalls";
import { moveBallFour } from "../methods/moveBall";
import { movePaddlesFour } from "../methods/movePaddles";
import { drawFour } from "../methods/draw";
import useLeaveGame from "../hooks/useLeaveGame";

const Four = () => {
  const user_id = getCookie("user_id") || "";
  const { data: user } = useGetUser(user_id || "0");
  const username: string = user?.username || "";
  const [startCountdown, setStartCountdown] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameAccepted, setGameAccepted] = useState(false);
  const paddleRightTopYRef = useRef(0);
  const paddleRightBottomYRef = useRef(0);
  const paddleLeftTopYRef = useRef(0);
  const paddleLeftBottomYRef = useRef(0);
  const myPaddleRef = useRef(0);
  const newBallPositionRef = useRef({ x: 0, y: 0 }); // Use a ref to store the current state
  const newAngleRef = useRef(0); // Use a ref to store the current state
  const { mutate: surrenderGame } = useSurrenderGame();
  const { mutate: leaveGame } = useLeaveGame();
  const { mutate: handleCreateGameFour } = useCreateGameFour(user_id || "0");
  const isFirstTime = useRef(true);
  const animationFrameId = useRef(0);
  const isAnimating = useRef(false);
  const isEnemyReadyRef = useRef(false);
  const playerReadyRef = useRef(0);
  const {
    newNotif,
    handleStartGameFour,
    handleSurrenderFour,
    handleMovePaddleFour,
    handleChangeBallDirectionFour,
    handleEnemyScoreFour,
    handleRefetchPlayers,
    handleReadyFour,
    handleReadyToStartFour,
  } = useGameSocket();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [leftScore, setLeftScore] = useState(0);
  const leftScoreRef = useRef(0);
  const [rightScore, setRightScore] = useState(0);
  const rightScoreRef = useRef(0);
  //game logic
  const { onGoingGame } = useGetFourGame(user_id || "0");

  // if (onGoingGame.isSuccess && onGoingGame.data !== null) {
  //     setStartGame(true);
  // }
  const dummyPlayer: User = {
    username: "player",
    avatar: "none",
    id: "",
  };

  const leftUserTop: User = onGoingGame?.data?.game?.user1 || dummyPlayer;
  const leftUserBottom: User = onGoingGame?.data?.game?.user2 || dummyPlayer;
  const rightUserTop: User = onGoingGame?.data?.game?.user3 || dummyPlayer;
  const rightUserBottom: User = onGoingGame?.data?.game?.user4 || dummyPlayer;

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

    let ballInLeftPaddle = false;
    let ballInRightPaddle = false;

    let ballRadius = 10;
    let x = canvas.width / 2;
    let y = canvas.height / 2;

    isFirstTime.current = true;

    if (username === onGoingGame.data?.game?.user1?.username) {
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
      handleChangeBallDirectionFour(
        newBallPositionRef.current.x,
        newBallPositionRef.current.y,
        newAngleRef.current,
        username,
        leftUserTop?.username || "",
        leftUserBottom?.username || "",
        rightUserTop?.username || "",
        rightUserBottom?.username || ""
      );
    }

    const paddleHeight = 80;
    const paddleWidth = 10;
    paddleRightTopYRef.current = (canvas.height - paddleHeight) / 4;
    paddleLeftTopYRef.current = (canvas.height - paddleHeight) / 4;
    paddleLeftBottomYRef.current = ((canvas.height - paddleHeight) * 3) / 4;
    paddleRightBottomYRef.current = ((canvas.height - paddleHeight) * 3) / 4;

    if (username === rightUserTop?.username)
      myPaddleRef.current = paddleRightTopYRef.current;
    if (username === rightUserBottom?.username)
      myPaddleRef.current = paddleRightBottomYRef.current;
    if (username === leftUserTop?.username)
      myPaddleRef.current = paddleLeftTopYRef.current;
    if (username === leftUserBottom?.username)
      myPaddleRef.current = paddleLeftBottomYRef.current;

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

    function returnFunction() {
      document.removeEventListener("keydown", handleKeyEvent, false);
      document.removeEventListener("keyup", handleKeyEvent, false);

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      isAnimating.current = false;
    }

    const canvasParams: canvasParamsFour = {
      canvas,
      ctx,
      paddleRightTopYRef,
      paddleRightBottomYRef,
      paddleLeftTopYRef,
      paddleLeftBottomYRef,
      newBallPositionRef,
      paddleLeftX,
      paddleRightX,
      paddleWidth,
      paddleHeight,
      ballRadius,
      isFirstTime,
      rightScoreRef,
      leftScoreRef,
      userLeftTop: leftUserTop,
      userLeftBottom: leftUserBottom,
      userRightTop: rightUserTop,
      userRightBottom: rightUserBottom,
    };

    const drawOnlineOne = () => {
      if (canvas === null) return;
      if (!gameAccepted) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawFour(canvasParams);

      // move paddles
      movePaddlesFour(
        canvasParams,
        handleMovePaddleFour,
        leftUserTop,
        leftUserBottom,
        rightUserTop,
        rightUserBottom,
        username,
        myPaddleRef,
        upPressed,
        downPressed
      );

      // Check for collision with left paddle
      changeBallDirectionFour(
        canvasParams,
        newAngleRef,
        ballInLeftPaddle,
        rightUserBottom,
        rightUserTop,
        leftUserBottom,
        leftUserTop,
        myPaddleRef,
        paddleRightX,
        ballInRightPaddle,
        handleChangeBallDirectionFour,
        username
      );

      // Check for score
      checkLoseConditionFour(
        canvas,
        leftScoreRef,
        rightScoreRef,
        setGameAccepted,
        setGameStarted,
        setStartCountdown,
        leftUserTop,
        leftUserBottom,
        rightUserTop,
        rightUserBottom,
        onGoingGame,
        handleSurrenderFour,
        username
      );

      // Change score
      changeScoreFour(
        canvasParams,
        setRightScore,
        setLeftScore,
        newAngleRef,
        handleChangeBallDirectionFour,
        handleEnemyScoreFour,
        username
      );

      // Check for collision with the horizontal walls
      checkCollisionWithHorizontalWalls(
        canvas,
        ballRadius,
        newBallPositionRef,
        newAngleRef
      );

      // Move the ball
      moveBallFour(
        canvasParams,
        user,
        leftUserTop,
        leftUserBottom,
        newAngleRef
      );

      // Check if enemy has left the game
      // enemyLeftGame();
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
      if (message[0] === "/showFour") {
        const sender = message[1];
        const receiver = message[2];
        handleReadyFour(sender, receiver);
      } else if (message[0] === "/readyFour") {
        playerReadyRef.current += 1;
        if (playerReadyRef.current === 4) {
          handleReadyToStartFour(
            leftUserTop?.username || "",
            leftUserBottom?.username || "",
            rightUserTop?.username || "",
            rightUserBottom?.username || ""
          );
          setStartCountdown(true);
        }
      } else if (message[0] === "/fourMove") {
        const paddleY = parseInt(message[1]);
        const playerMoved = message[2];
        if (playerMoved === leftUserTop?.username) {
          paddleLeftTopYRef.current = paddleY;
        } else if (playerMoved === leftUserBottom?.username) {
          paddleLeftBottomYRef.current = paddleY;
        } else if (playerMoved === rightUserTop?.username) {
          paddleRightTopYRef.current = paddleY;
        } else if (playerMoved === rightUserBottom?.username) {
          paddleRightBottomYRef.current = paddleY;
        }
      } else if (message[0] === "/startFour") {
        setGameStarted(true);
        setStartCountdown(true);
        playerReadyRef.current = 0;
      } else if (message[0] === "/start") {
        // invitaionsData.refetch();
        onGoingGame.refetch();
        handleRefetchPlayers(
          leftUserTop?.username || "",
          leftUserBottom?.username || "",
          rightUserTop?.username || "",
          rightUserBottom?.username || ""
        );
        isFirstTime.current = true;
        setGameAccepted(true);
        // setStartCountdown(true);
      } else if (message[0] === "/refetchPlayers") {
        onGoingGame.refetch();
      } else if (message[0] === "/score") {
        isFirstTime.current = true;
        const score = parseInt(message[1]);
        const user = message[2];
        if (
          user === leftUserTop?.username ||
          user === leftUserBottom?.username
        ) {
          rightScoreRef.current = score;
          setRightScore(score);
        } else {
          leftScoreRef.current = score;
          setLeftScore(score);
        }
      } else if (message[0] === "/end") {
        setGameAccepted(false);
        setGameStarted(false);
        setStartCountdown(false);
        onGoingGame.refetch();
        // } else if (message[0] === "/move") {
        //   PaddleRightYRef.current = parseInt(message[1]); // Update the ref
      } else if (message[0] === "/fourBallDirection") {
        newBallPositionRef.current = {
          x: parseInt(message[1]),
          y: parseInt(message[2]),
        };
        if (
          canvasRef.current &&
          (newBallPositionRef.current.x < canvasRef.current.width / 6 ||
            newBallPositionRef.current.x > (canvasRef.current.width * 5) / 6)
        ) {
          isFirstTime.current = false;
        }
        newAngleRef.current = parseFloat(message[3]); // Update the ref
      }
    }
  }, [newNotif()?.data]);

  useEffect(() => {
    if (
      onGoingGame.isSuccess &&
      onGoingGame.data !== null &&
      onGoingGame.data.game !== "null" &&
      onGoingGame.data.game !== null &&
      onGoingGame.data.game !== ""
    ) {
      setGameAccepted(true);
    } else {
      setGameAccepted(false);
    }
  }, [onGoingGame.isSuccess, onGoingGame.data]);

  return (
    // <div className="w-full h-fit flex flex-col justify-center items-center">

    <div className="p-4 h-fit  flex flex-col mx-auto justify-center w-full">
      <h1 className="text-4xl mx-auto">Four Player Game</h1>
      {gameAccepted && (
        <>
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
          <Players
            topLeft={leftUserTop}
            topRight={rightUserTop}
            bottomLeft={leftUserBottom}
            bottomRight={rightUserBottom}
            username={username}
          />
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
                  handleStartGameFour(
                    username,
                    leftUserTop?.username || "",
                    leftUserBottom?.username || "",
                    rightUserTop?.username || "",
                    rightUserBottom?.username || ""
                  );
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
                handleSurrenderFour(
                  username,
                  leftUserTop?.username || "",
                  leftUserBottom?.username || "",
                  rightUserTop?.username || "",
                  rightUserBottom?.username || "",
                  username === rightUserTop?.username ||
                    username === rightUserBottom?.username
                    ? "left"
                    : "right",
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
          {onGoingGame.isLoading && (
            <h1 className="text-4xl">Waiting for the game to start</h1>
          )}
        </>
      )}
      {!gameAccepted && (
        <>
          <h1 className="text-4xl">Create a game for four people to play!</h1>
          <Button
            onClick={() => {
              handleCreateGameFour(username);
            }}
          >
            Create Game
          </Button>
        </>
      )}
    </div>
  );
};

export default Four;
