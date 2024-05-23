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
import useGetUser from "@/app/profile/hooks/useGetUser";
import getCookie from "@/lib/functions/getCookie";
import useGetGame from "../hooks/useGetGames";
import useEndGame from "../hooks/useEndGame";
import useGameSocket from "@/lib/hooks/useGameSocket";
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
  const leftUserRef = useRef<string>("");
  const rightUserRef = useRef<string>("");

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  const {
    newNotif,
    handleStartGame,
    handleSurrender,
    handleMovePaddle,
    handleChangeBallDirection,
    handleEnemyScore,
  } = useGameSocket();
  const user_id = getCookie("user_id") || "";
  const { data: user } = useGetUser(user_id || "0");
  const { onGoingGame } = useGetGame(user_id || "0", type);
  const { mutate: endGame } = useEndGame();

  const username = user?.username || "";
  let rightUser: User | undefined;
  let leftUser: User | undefined;

  if (onGoingGame.isSuccess) {
    rightUser =
      onGoingGame?.data?.game?.user1?.username === username
        ? onGoingGame?.data?.game?.user2
        : onGoingGame?.data?.game?.user1;
    leftUser =
      onGoingGame?.data?.game?.user1?.username === username
        ? onGoingGame?.data?.game?.user1
        : onGoingGame?.data?.game?.user2;
  }

  useEffect(() => {
    const notif = newNotif();
    if (notif) {
      const parsedMessage = JSON.parse(notif.data);
      const message = parsedMessage?.message.split(" ");
      // console.log(message);
      if (message[0] === "/show") {
        gameStartedRef.current = true;
        isFirstTime.current = true;
        if (leftUser?.username === onGoingGame.data?.game?.user1?.username) {
          if (canvasRef.current) {
            const enemyX =
              canvasRef.current?.width - newBallPositionRef.current.x;
            const enemyY = newBallPositionRef.current.y;
            const enemyAngle = Math.PI - newAngleRef.current;
            handleChangeBallDirection(
              enemyX,
              enemyY,
              enemyAngle,
              rightUser?.username || ""
            );
          }
        }
        handleStartGame(
          onGoingGame.data?.game?.user1?.username,
          onGoingGame.data?.game?.user2?.username
        );
        // onGoingGame.refetch();
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
        message[1] === leftUser?.username
          ? (leftScoreRef.current = parseInt(message[2]))
          : (rightScoreRef.current = parseInt(message[2]));
        message[3] === leftUser?.username
          ? (leftScoreRef.current = parseInt(message[4]))
          : (rightScoreRef.current = parseInt(message[4]));
        isFirstTime.current = true;
      } else if (message[0] === "/end") {
        gameStartedRef.current = false;
        onGoingGame.refetch();
      }
    }
  }, [newNotif()?.data]);

  useEffect(() => {
    if (onGoingGame.data?.game?.user1 === undefined) {
      gameStartedRef.current = false;
    }
    setCanvas(canvasRef.current);
    leftUserRef.current = leftUser?.username || "";
    rightUserRef.current = rightUser?.username || "";
    if (canvas) {
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
        const enemyX = canvas.width - newBallPositionRef.current.x;
        const enemyY = newBallPositionRef.current.y;
        const enemyAngle = Math.PI - newAngleRef.current;
        handleChangeBallDirection(
          enemyX,
          enemyY,
          enemyAngle,
          rightUserRef.current
        );
      }

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
      // function returnFunction() {
      //   document.removeEventListener("keydown", handleKeyEvent, false);
      //   document.removeEventListener("keyup", handleKeyEvent, false);

      //   if (animationFrameId.current) {
      //     cancelAnimationFrame(animationFrameId.current);
      //   }
      //   isAnimating.current = false;
      // }

      const drawOnlineOne = () => {
        if (canvas === null) return;
        if (gameStartedRef.current) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // draw paddles and ball
          draw(canvasParams, ctx);

          // move paddles
          movePaddlesOnline(canvasParams, handleMovePaddle, rightUser);
          // console.log("move paddle" + movePaddleRef.current);

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
            leftUser,
            rightUser,
            onGoingGame,
            handleSurrender,
            endGame,
            gameStartedRef
          );

          // Change score
          changeScoreOnline(
            canvasParams,
            newAngleRef,
            handleChangeBallDirection,
            handleEnemyScore,
            rightUser,
            leftUser
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
          // enemyLeftGame(
          //   leftUser,
          //   rightUser,
          //   onGoingGame,
          //   newBallPositionRef,
          //   handleSurrender,
          //   canvas,
          //   endGame
          // );
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
          // Add a click event listener to the canvas
          canvas.addEventListener("click", (e) => {
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
              handleStartGame(leftUserRef.current, rightUserRef.current);
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
      }
    }
  }, [canvas, onGoingGame.data?.game.user1]);

  return (
    <div className="w-full h-fit flex flex-col justify-center items-center">
      <canvas
        ref={canvasRef}
        height="400"
        width="800"
        className="w-full md:w-5/6 h-[400px] lg:h-[500px] max-w-[800px] bg-black border-2 border-yellow-500 mx-auto"
      ></canvas>
      <Actions gameStarted={gameStartedRef.current} type={type} />
    </div>
  );
};

export default Game;
