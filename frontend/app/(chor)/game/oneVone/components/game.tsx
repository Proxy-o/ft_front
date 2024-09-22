"use client";

import { useEffect, useRef, useState } from "react";
import { canvasParams } from "../../types";
import { draw } from "../../methods/draw";
import { movePaddlesOnline } from "../../methods/movePaddles";
import { changeBallDirectionOnline } from "../../methods/changeBallDirection";
import { checkLoseConditionOnline } from "../../methods/checkLoseCondition";
import { changeScoreOnline } from "../../methods/changeScore";
import checkCollisionWithHorizontalWalls from "../../methods/checkCollisionWithHorizontalWalls";
import { moveBall } from "../../methods/moveBall";
import { User } from "@/lib/types";
import getCookie from "@/lib/functions/getCookie";
import useEndGame from "../../hooks/useEndGame";
import useGameSocket from "@/app/(chor)/game/hooks/sockets/useGameSocket";
import useInvitationSocket from "@/app/(chor)/game/hooks/sockets/useInvitationSocket";
import { enemyLeftGame } from "../../methods/enemyLeftGame";
import useGetUser from "../../../profile/hooks/useGetUser";
import { Card } from "@/components/ui/card";
import NoGame from "../../components/noGame";
import PreGame from "../../components/preGame";
import { useQueryClient } from "@tanstack/react-query";
import Actions from "./actions";
import Score from "./score";

const Game = ({
  type,
  onGoingGame,
  tournamentId,
}: {
  type: string;
  onGoingGame: any;
  tournamentId?: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>(0);
  const isAnimating = useRef<boolean>(false);
  const isFirstTime = useRef<boolean>(true);
  const paddleLeftYRef = useRef<number>(0);
  const PaddleRightYRef = useRef<number>(0);
  const paddleRightDirectionRef = useRef<string>("stop");
  const newBallPositionRef = useRef({
    x: (canvasRef.current?.width || 0) / 2,
    y: (canvasRef.current?.height || 0) / 2,
  });
  const newAngleRef = useRef<number>(0);
  const leftScoreRef = useRef<number>(0);
  const rightScoreRef = useRef<number>(0);
  const upPressedRef = useRef<boolean>(false);
  const downPressedRef = useRef<boolean>(false);
  const gameStartedRef = useRef<boolean>(false);
  const leftUser = useRef<User | undefined>(undefined);
  const rightUser = useRef<User | undefined>(undefined);
  const controllerUser = useRef<User | undefined>(undefined);
  const timeRef = useRef<number>(0);
  const enemyLeftGameRef = useRef<boolean>(false);
  const gameIdRef = useRef<string>("");
  const userRef = useRef<User | undefined>(undefined);
  const state = useRef<string>("none");
  const ballInLeftPaddle = useRef<boolean>(false);
  const bgImage = useRef<HTMLImageElement | null>(null);

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  const {
    gameMsg,
    handleMovePaddle,
    handleChangeBallDirection,
    handleEnemyScore,
    handleTime,
    handleStartGame,
  } = useGameSocket();

  const { newNotif } = useInvitationSocket();

  const query = useQueryClient();

  const user_id = getCookie("user_id") || "";
  const { data: user } = useGetUser(user_id || "0");
  // const { mutate: surrenderGame } = useSurrenderGame();
  // const { mutate: leaveGame } = useLeaveGame();
  const { mutate: endGame } = useEndGame();

  userRef.current = user;

  const username = user?.username || "";

  function changeTime(Time: number) {
    timeRef.current = Time;
  }

  if (onGoingGame?.data?.game?.user1?.username === username) {
    leftUser.current = onGoingGame?.data?.game?.user1;
    rightUser.current = onGoingGame?.data?.game?.user2;
    leftScoreRef.current = onGoingGame?.data?.game?.user1_score;
    rightScoreRef.current = onGoingGame?.data?.game?.user2_score;
  } else {
    leftUser.current = onGoingGame?.data?.game?.user2;
    rightUser.current = onGoingGame?.data?.game?.user1;
    leftScoreRef.current = onGoingGame?.data?.game?.user2_score;
    rightScoreRef.current = onGoingGame?.data?.game?.user1_score;
  }

  controllerUser.current = onGoingGame?.data?.game?.user1;

  gameIdRef.current = onGoingGame?.data?.game?.id || "";

  const paddleHeight = 60;
  const paddleWidth = 15;
  let ballRadius = 10;

  let canvasParams: canvasParams = {
    canvas,
    paddleRightX: 0,
    paddleLeftX: 0,
    paddleLeftYRef,
    PaddleRightYRef,
    paddleRightDirectionRef,
    newBallPositionRef,
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
    gameIdRef,
  };
  useEffect(() => {
    if (canvas === null && canvasRef.current) {
      setCanvas(canvasRef.current);
    }
    if (canvas === null) return;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    let x = canvas.width / 2;
    let y = canvas.height / 2;

    const paddleLeftX = 0;
    const paddleRightX = canvas.width - paddleWidth;
    paddleLeftYRef.current = (canvas.height - paddleHeight) / 2;
    PaddleRightYRef.current = (canvas.height - paddleHeight) / 2;

    isFirstTime.current = true;

    rightScoreRef.current = 0;
    leftScoreRef.current = 0;

    canvasParams.paddleRightX = paddleRightX;
    canvasParams.paddleLeftX = paddleLeftX;

    const handleKeyEvent = (e: KeyboardEvent) => {
      // preventDefault to prevent the page from scrolling
      if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
      if (e.type === "keydown") {
        if (e.key === "ArrowUp" && !upPressedRef.current) {
          upPressedRef.current = true;
          downPressedRef.current = false;
          handleMovePaddle("up", paddleLeftYRef.current);
        } else if (e.key === "ArrowDown" && !downPressedRef.current) {
          downPressedRef.current = true;
          upPressedRef.current = false;
          handleMovePaddle("down", paddleLeftYRef.current);
        }
      }
      if (e.type === "keyup") {
        if (e.key === "ArrowUp") {
          upPressedRef.current = false;
          if (!downPressedRef.current)
            handleMovePaddle("stop", paddleLeftYRef.current);
        } else if (e.key === "ArrowDown") {
          downPressedRef.current = false;
          if (!upPressedRef.current)
            handleMovePaddle("stop", paddleLeftYRef.current);
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

    const gameStarted = () => {
      setTimeout(() => {
        if (
          username === controllerUser.current?.username &&
          newAngleRef.current === 0
        ) {
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
      }, 1000);

      if (bgImage.current === null) {
        bgImage.current = new Image();
        bgImage.current.src = "/game.jpeg";
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 0.5;
      ctx.drawImage(bgImage.current, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
      // draw paddles and ball
      draw(canvasParams, ctx);

      // move paddles
      movePaddlesOnline(canvasParams);

      // // Check for collision with left paddle
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
        endGame,
        gameStartedRef,
        setCanvas
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
      if (
        newAngleRef.current !== 0 &&
        leftScoreRef.current < 77777 &&
        rightScoreRef.current < 77777
      ) {
        moveBall(canvasParams, user, leftUser.current, newAngleRef);
      }

      // Check if enemy has left the game
      enemyLeftGame(
        canvasParams,
        timeRef,
        enemyLeftGameRef,
        gameStartedRef,
        handleTime,
        endGame
      );
    };

    const animate = () => {
      if (canvas === null) return;

      if (
        gameStartedRef.current &&
        leftUser.current !== undefined &&
        rightUser.current !== undefined
      ) {
        gameStarted();
      }
      animationFrameId.current = requestAnimationFrame(animate);
    };

    if (!isAnimating.current) {
      isAnimating.current = true;
      animate();
      return returnFunction;
    }
  }, [gameStartedRef.current, canvasRef.current]);

  useEffect(() => {
    const gameMsge = gameMsg();
    if (gameMsge) {
      const parsedMessage = JSON.parse(gameMsge.data);
      // console.log(parsedMessage.message);
      const message = parsedMessage?.message.split(" ");

      if (message[0] === "/move") {
        const sender = message[3];
        if (sender !== username) {
          paddleRightDirectionRef.current = message[1];
          PaddleRightYRef.current = parseInt(message[2]);
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
        // console.log("showing");
        if (!gameStartedRef.current) {
          handleStartGame(
            leftUser.current?.username || "",
            rightUser.current?.username || "",
            gameIdRef.current
          );
          changeTime(0);
          gameStartedRef.current = true;
          newBallPositionRef.current = { x: 400, y: 200 };
          newAngleRef.current = 0;
          paddleRightDirectionRef.current = "stop";
          isFirstTime.current = true;
          ballInLeftPaddle.current = false;
          upPressedRef.current = false;
          downPressedRef.current = false;
          leftScoreRef.current = 0;
          rightScoreRef.current = 0;
          enemyLeftGameRef.current = false;
          onGoingGame.refetch();
        }
      } else if (message[0] === "/score") {
        // console.log("refetching");
        isFirstTime.current = true;
        onGoingGame.refetch();
      } else if (message[0] === "/time") {
        if (message[2] !== username) {
          changeTime(parseInt(message[1]));
          enemyLeftGameRef.current = false; // todo: tournament forfeit status
        }
      } else if (message[0] === "/surrender") {
        if (message[1] !== username) {
          state.current = "surrendered";
        } else {
          state.current = "none";
        }
        gameStartedRef.current = false;
        setCanvas(null);
        onGoingGame.refetch();
      } else if (message[0] === "/endGame") {
        if (leftScoreRef.current < 77777 && rightScoreRef.current < 77777) {
          state.current = "leave";
        } else if (leftScoreRef.current >= 77777) {
          state.current = "win";
        } else if (rightScoreRef.current >= 77777) {
          state.current = "lose";
        } else {
          state.current = "none";
        }
        gameStartedRef.current = false;
        setCanvas(null);
        onGoingGame.refetch();
      }
    }
  }, [gameMsg()?.data]);

  useEffect(() => {
    const notif = newNotif();
    if (notif) {
      const parsedMessage = JSON.parse(notif.data);
      const message = parsedMessage?.message.split(" ");
      if (
        message[0] === "/start" ||
        message[0] === "/refetchTournament" ||
        message[0] === "/refetchPlayers"
      ) {
        onGoingGame.refetch();
      }
    }
  }, [newNotif()?.data]);

  return (
    <div className="w-full h-fit flex flex-col max-w-[800px]  justify-center items-center gap-2">
      {gameStartedRef.current && (
          <Score
            leftScoreRef={leftScoreRef}
            rightScoreRef={rightScoreRef}
            leftUserRef={leftUser}
            rightUserRef={rightUser}
          />
        )}
      <Card className="w-full max-w-[900px] h-[350px] md:h-[400px]">
        {leftUser.current?.username &&
        leftScoreRef.current < 77777 &&
        rightScoreRef.current < 77777 ? (
          <>
            {gameStartedRef.current ? (
              <canvas
                ref={canvasRef}
                height="400"
                width="800"
                className={`w-full h-full`}
              ></canvas>
            ) : (
              <PreGame
                type={type}
                leftUserTop={leftUser.current}
                rightUserTop={rightUser.current}
                leftUserBottom={null}
                rightUserBottom={null}
              />
            )}
          </>
        ) : (
          !gameStartedRef.current && <NoGame state={state} />
        )}
      </Card>
      <Actions
        canvasPrams={canvasParams}
        gameStartedRef={gameStartedRef}
        type={type}
      />
    </div>
  );
};

export default Game;
