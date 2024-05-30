"use client";

import { useEffect, useRef, useState } from "react";
import { canvasParams } from "../types";
import { draw } from "../methods/draw";
import { movePaddlesOnline } from "../methods/movePaddles";
import { changeBallDirectionOnline } from "../methods/changeBallDirection";
import { checkLoseConditionOnline } from "../methods/checkLoseCondition";
import { changeScoreOnline } from "../methods/changeScore";
import checkCollisionWithHorizontalWalls from "../methods/checkCollisionWithHorizontalWalls";
import { moveBall } from "../methods/moveBall";
import { User } from "@/lib/types";
import getCookie from "@/lib/functions/getCookie";
import useGetGame from "../hooks/useGetGames";
import useEndGame from "../hooks/useEndGame";
import useGameSocket from "@/lib/hooks/useGameSocket";
import useInvitationSocket from "@/lib/hooks/useInvitationSocket";
import { enemyLeftGame } from "../methods/enemyLeftGame";
import useGetUser from "../../profile/hooks/useGetUser";
import Actions from "../components/actions";

const Game = ({ type }: { type: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>(0);
  const isAnimating = useRef<boolean>(false);
  const isFirstTime = useRef<boolean>(true);
  const paddleLeftYRef = useRef<number>(0);
  const PaddleRightYRef = useRef<number>(0);
  const newBallPositionRef = useRef({ x: 0, y: 0 });
  const newAngleRef = useRef<number>(0);
  const leftScoreRef = useRef<number>(0);
  const rightScoreRef = useRef<number>(0);
  const upPressedRef = useRef<boolean>(false);
  const downPressedRef = useRef<boolean>(false);
  const gameStartedRef = useRef<boolean>(false);
  const clickedRef = useRef<boolean>(false);
  const leftUser = useRef<User | undefined>(undefined);
  const rightUser = useRef<User | undefined>(undefined);
  const controllerUser = useRef<User | undefined>(undefined);
  const timeRef = useRef<number>(0);
  const enemyLeftGameRef = useRef<boolean>(false);
  const gameIdRef = useRef<string>("");

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const {
    gameMsg,
    handleMovePaddle,
    handleChangeBallDirection,
    handleEnemyScore,
    handleTime,
    handleDisconnect,
    handleStartGame,
  } = useGameSocket();
  const { newNotif } = useInvitationSocket();

  const user_id = getCookie("user_id") || "";
  const { data: user } = useGetUser(user_id || "0");
  const { onGoingGame } = useGetGame(user_id || "0", type);
  const { mutate: endGame } = useEndGame();

  const username = user?.username || "";

  rightUser.current =
    onGoingGame?.data?.game?.user1?.username === username
      ? onGoingGame?.data?.game?.user2
      : onGoingGame?.data?.game?.user1;
  leftUser.current =
    onGoingGame?.data?.game?.user1?.username === username
      ? onGoingGame?.data?.game?.user1
      : onGoingGame?.data?.game?.user2;

  controllerUser.current = onGoingGame?.data?.game?.user1;

  gameIdRef.current = onGoingGame?.data?.game.id || "";

  useEffect(() => {
    setCanvas(canvasRef.current);
    if (canvas === null) return;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return; // Exit if context is not available

    let ballInLeftPaddle = false;

    let ballRadius = 10;
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    const paddleHeight = 70;
    const paddleWidth = 20;

    paddleLeftYRef.current = (canvas.height - paddleHeight) / 2;
    PaddleRightYRef.current = (canvas.height - paddleHeight) / 2;

    isFirstTime.current = true;

    rightScoreRef.current = 0;
    leftScoreRef.current = 0;

    const paddleLeftX = 35;

    const paddleRightX = canvas.width - 35 - paddleWidth;
    let canvasParams: canvasParams = {
      canvas,
      paddleLeftYRef,
      paddleRightX,
      PaddleRightYRef,
      newBallPositionRef,
      paddleLeftX,
      paddleWidth,
      paddleHeight,
      ballRadius,
      upPressedRef,
      downPressedRef,
      isFirstTime,
      rightScoreRef,
      leftScoreRef,
      leftUserRef: leftUser,
      rightUserRef: rightUser,
    };

    const handleKeyEvent = (e: KeyboardEvent) => {
      // preventDefault to prevent the page from scrolling
      if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
      if (e.type === "keydown") {
        if (e.key === "ArrowUp") {
          upPressedRef.current = true;
        } else if (e.key === "ArrowDown") {
          downPressedRef.current = true;
        }
      } else if (e.type === "keyup") {
        if (e.key === "ArrowUp") {
          upPressedRef.current = false;
        } else if (e.key === "ArrowDown") {
          downPressedRef.current = false;
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
      if (gameStartedRef.current) {
        if (
          username === controllerUser.current?.username &&
          newAngleRef.current === 0
        ) {
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
          let enemyX = canvas.width - newBallPositionRef.current.x;
          let enemyY = newBallPositionRef.current.y;
          let enemyAngle = Math.PI - newAngleRef.current;
          handleChangeBallDirection(
            enemyX,
            enemyY,
            enemyAngle,
            rightUser.current?.username || ""
          );
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw paddles and ball
        draw(canvasParams, ctx);

        // move paddles
        movePaddlesOnline(canvasParams, handleMovePaddle);
        // console.log("move paddle" + movePaddleRef.current);

        // Check for collision with left paddle
        changeBallDirectionOnline(
          canvasParams,
          newAngleRef,
          ballInLeftPaddle,
          handleChangeBallDirection,
          rightUser.current
        );

        // Check for score
        checkLoseConditionOnline(
          canvas,
          leftScoreRef,
          rightScoreRef,
          leftUser.current,
          rightUser.current,
          onGoingGame,
          endGame,
          gameStartedRef
        );

        // Change score
        changeScoreOnline(
          canvasParams,
          newAngleRef,
          handleChangeBallDirection,
          handleEnemyScore,
          rightUser.current,
          leftUser.current
        );

        // Check for collision with the horizontal walls
        checkCollisionWithHorizontalWalls(
          canvas,
          ballRadius,
          newBallPositionRef,
          newAngleRef
        );

        // Move the ball
        moveBall(canvasParams, user, leftUser.current, newAngleRef);

        // Check if enemy has left the game
        enemyLeftGame(
          canvasParams,
          timeRef,
          enemyLeftGameRef,
          gameStartedRef,
          handleTime,
          endGame
        );
      } else {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the button
        ctx.fillStyle = "blue";
        ctx.fillRect(50, 50, 100, 40); // Adjust coordinates and dimensions as needed

        // Add text to the button
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Click Me", 65, 80); // Adjust text position as needed

        const drawPlayers = () => {
          if (canvas === null) return;
          // italic and bold
          ctx.font = "italic bold 50px Arial";
          ctx.fillStyle = "#0095DD";
          ctx.fillText(
            leftUser.current?.username || "",
            canvas.width / 2 - 150,
            canvas.height / 2 - 20
          );
          ctx.fillText(
            rightUser.current?.username || "",
            canvas.width / 2 + 150,
            canvas.height / 2 - 20
          );
        };

        drawPlayers();

        // Add a click event listener to the canvas
        canvas.addEventListener("mousedown", (e) => {
          const rect = canvas.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          // Check if the click was inside the button
          if (
            x >= 50 &&
            x <= 150 &&
            y >= 50 &&
            y <= 90 &&
            !clickedRef.current
          ) {
            // show a message to the user for 3 seconds
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "white";
            ctx.font = "20px Arial";
            handleStartGame(
              leftUser.current?.username || "",
              rightUser.current?.username || "",
              gameIdRef.current
            );
            console.log("game started");
            clickedRef.current = true;
          }
        });
        canvas.addEventListener("mouseup", (e) => {
          clickedRef.current = false;
        });
      }
    };

    const animate = () => {
      if (canvas === null) return;

      drawOnlineOne();
      animationFrameId.current = requestAnimationFrame(animate);
    };

    if (!isAnimating.current) {
      isAnimating.current = true;
      animate();
      return returnFunction;
    }
  }, [canvas, onGoingGame.data?.game.user1]);

  useEffect(() => {
    const gameMsge = gameMsg();
    if (gameMsge) {
      const parsedMessage = JSON.parse(gameMsge.data);
      console.log(parsedMessage.message);
      const message = parsedMessage?.message.split(" ");
      if (message[0] === "/move") {
        const sender = message[2];
        if (sender !== username) {
          PaddleRightYRef.current = parseInt(message[1]);
        }
      } else if (message[0] === "/ballDirection") {
        const sender = message[4];
        if (sender !== username) {
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
          newAngleRef.current = parseFloat(message[3]);
        }
      } else if (message[0] === "/show") {
        if (!gameStartedRef.current) {
          handleStartGame(
            leftUser.current?.username || "",
            rightUser.current?.username || "",
            gameIdRef.current
          );
          timeRef.current = 0;
          console.log("game started");
        }
        gameStartedRef.current = true;
        // isFirstTime.current = true;
        setGameStarted((prev) => !prev);
        onGoingGame.refetch();
      } else if (message[0] === "/score") {
        isFirstTime.current = true;
        if (message[2] !== username) {
          leftScoreRef.current = parseInt(message[1]);
        }
      } else if (message[0] === "/time") {
        if (message[2] !== username) {
          timeRef.current = parseInt(message[1]);
          enemyLeftGameRef.current = false;
        }
      } else if (message[0] === "/end") {
        gameStartedRef.current = false;
        onGoingGame.refetch();
      }
    }
  }, [gameMsg()?.data]);
  useEffect(() => {
    const notif = newNotif();
    if (notif) {
      const parsedMessage = JSON.parse(notif.data);
      const message = parsedMessage?.message.split(" ");
      console.log(parsedMessage.message);

      if (message[0] === "/start") {
        onGoingGame.refetch();
      } else if (message[0] === "/end") {
        handleDisconnect();
        gameStartedRef.current = false;
        onGoingGame.refetch();
      }
    }
  }, [newNotif()?.data]);

  return (
    <div className="w-full h-fit flex flex-col justify-center items-center">
      <canvas
        ref={canvasRef}
        height="400"
        width="800"
        className="w-full md:w-5/6 h-[400px] lg:h-[500px] max-w-[800px] bg-black border-2 border-white mx-auto"
      ></canvas>
      <Actions
        gameStartedRef={gameStartedRef}
        type={type}
        userLeftTop={leftUser.current?.username || ""}
        userRightTop={rightUser.current?.username || ""}
        userLeftBottom={""}
        userRightBottom={""}
        gameId={onGoingGame.data?.game.id}
      />
    </div>
  );
};

export default Game;
