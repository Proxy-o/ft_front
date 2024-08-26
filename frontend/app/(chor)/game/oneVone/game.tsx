"use client";

import { useEffect, useRef, useState } from "react";
import { canvasParams } from "../types";
import { draw, drawPlayers } from "../methods/draw";
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
import useGameSocket from "@/app/(chor)/game/hooks/useGameSocket";
import useInvitationSocket from "@/app/(chor)/game/hooks/useInvitationSocket";
import { enemyLeftGame } from "../methods/enemyLeftGame";
import useGetUser from "../../profile/hooks/useGetUser";
import useSurrenderGame from "../hooks/useSurrender";
import useLeaveGame from "../hooks/useLeaveGame";
import { Button } from "@/components/ui/button";
import { DoorOpen, Flag, Gamepad } from "lucide-react";
import { Card } from "@/components/ui/card";
import NoGame from "../components/noGame";
import PreGame from "../components/preGame";
import Sockets from "../components/sockets";

const Game = ({ type }: { type: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>(0);
  const isAnimating = useRef<boolean>(false);
  const isFirstTime = useRef<boolean>(true);
  const paddleLeftYRef = useRef<number>(0);
  const PaddleRightYRef = useRef<number>(0);
  const paddleRightDirectionRef = useRef<string>("stop");
  const newBallPositionRef = useRef({ x: 20000, y: 20000 });
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
    handleMovePaddle,
    handleChangeBallDirection,
    handleEnemyScore,
    handleTime,
    handleStartGame,
  } = useGameSocket();

  const { handleSurrender } = useInvitationSocket();
  const user_id = getCookie("user_id") || "";
  const { data: user } = useGetUser(user_id || "0");
  const { mutate: surrenderGame } = useSurrenderGame();
  const { mutate: leaveGame } = useLeaveGame();
  const { mutate: endGame } = useEndGame();
  const { onGoingGame } = useGetGame(user_id || "0", type);

  userRef.current = user;

  const username = user?.username || "";

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

  useEffect(() => {
    if (canvas === null && canvasRef.current) {
      setCanvas(canvasRef.current);
    }
    if (canvas === null) return;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    let ballRadius = 10;
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    const paddleHeight = 60;
    const paddleWidth = 15;

    paddleLeftYRef.current = (canvas.height - paddleHeight) / 2;
    PaddleRightYRef.current = (canvas.height - paddleHeight) / 2;

    isFirstTime.current = true;

    rightScoreRef.current = 0;
    leftScoreRef.current = 0;

    const paddleLeftX = 0;
    const paddleRightX = canvas.width - paddleWidth;

    let canvasParams: canvasParams = {
      canvas,
      paddleLeftYRef,
      paddleRightX,
      PaddleRightYRef,
      paddleRightDirectionRef,
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
      gameIdRef,
    };

    const handleKeyEvent = (e: KeyboardEvent) => {
      // preventDefault to prevent the page from scrolling
      if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
      if (e.type === "keydown") {
        if (e.key === "ArrowUp") {
          upPressedRef.current = true;
          downPressedRef.current = false;
          handleMovePaddle("up", paddleLeftYRef.current);
        } else if (e.key === "ArrowDown") {
          downPressedRef.current = true;
          upPressedRef.current = false;
          handleMovePaddle("down", paddleLeftYRef.current);
        }
      } else if (e.type === "keyup") {
        if (e.key === "ArrowUp") {
          upPressedRef.current = false;
          handleMovePaddle("stop", paddleLeftYRef.current);
        } else if (e.key === "ArrowDown") {
          downPressedRef.current = false;
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
      if (
        username === controllerUser.current?.username &&
        newAngleRef.current === 0
      ) {
        newBallPositionRef.current = { x, y }; // Initialize the ref
        newAngleRef.current = Math.random() * Math.PI;
        while (
          (newAngleRef.current > Math.PI / 6 &&
            newAngleRef.current <   (Math.PI * 5) / 6) ||
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
      // // console.log("move paddle" + movePaddleRef.current);

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
      if (newAngleRef.current !== 0)
        moveBall(canvasParams, user, leftUser.current, newAngleRef);

      // Check if enemy has left the game
      console.log("timeRef.current", timeRef.current);
      enemyLeftGame(
        canvasParams,
        timeRef,
        enemyLeftGameRef,
        gameStartedRef,
        handleTime,
        endGame
      );
    };

    const drawOnlineOne = () => {
      if (canvas === null) return;
      if (
        gameStartedRef.current &&
        leftUser.current !== undefined &&
        rightUser.current !== undefined
      ) {
        gameStarted();
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
  }, [gameStartedRef.current, canvasRef.current]);

  

  return (
    <>
      <Card className="w-full h-[350px] md:h-[400px]">
        {leftUser.current?.username ? (
          <>
            {gameStartedRef.current ? (
              <canvas
                ref={canvasRef}
                height="400"
                width="800"
                className={`w-full h-full`}
              ></canvas>
            ) : (
              <div
                className={`w-full h-full flex justify-center items-center ${
                  gameStartedRef.current ? "hidden" : "block"
                }`}
                style={{
                  backgroundImage: "url('/game.jpeg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <PreGame
                  type={type}
                  leftUserTop={leftUser.current}
                  rightUserTop={rightUser.current}
                  leftUserBottom={null}
                  rightUserBottom={null}
                />
              </div>
            )}
          </>
        ) : (
          <NoGame state={state} />
        )}
      </Card>
      {rightUser.current?.username && (
        <div className="w-full md:w-5/6 h-[70px] max-w-[800px] flex justify-between items-center mt-4">
          {!gameStartedRef.current ? (
            <>
              <div className="ml-[80px] h-5/6 w-1/6">
                <Button
                  onClick={() => {
                    handleStartGame(
                      leftUser.current?.username || "",
                      rightUser.current?.username || "",
                      gameIdRef.current
                    );
                    
                  }}
                  className="h-full w-full bg-primary"
                >
                  <Gamepad size={25} />
                  Start
                </Button>
              </div>
              {type !== "tournament" && (
                <div className="mr-[80px] h-5/6 w-1/6">
                  <Button
                    onClick={() => {
                      leaveGame();
                      handleSurrender(
                        leftUser.current?.username || "",
                        rightUser.current?.username || "",
                        gameIdRef.current
                      );
                    }}
                    className="h-full w-full bg-primary"
                  >
                    <DoorOpen size={25} />
                    Leave
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="ml-[80px] h-5/6 w-1/6">
              <Button
                onClick={() => {
                  setCanvas(null);
                  surrenderGame();
                  handleSurrender(
                    leftUser.current?.username || "",
                    rightUser.current?.username || "",
                    gameIdRef.current
                  );
                }}
                className="h-full w-full bg-primary"
              >
                <Flag size={25} />
                Surrender
              </Button>
            </div>
          )}
        </div>
      )}
      <Sockets
        canvasRef={canvasRef}
        PaddleRightYRef={PaddleRightYRef}
        newBallPositionRef={newBallPositionRef}
        newAngleRef={newAngleRef}
        isFirstTime={isFirstTime}
        ballInLeftPaddle={ballInLeftPaddle}
        paddleRightDirectionRef={paddleRightDirectionRef}
        upPressedRef={upPressedRef}
        downPressedRef={downPressedRef}
        leftScoreRef={leftScoreRef}
        rightScoreRef={rightScoreRef}
        enemyLeftGameRef={enemyLeftGameRef}
        leftUser={leftUser}
        rightUser={rightUser}
        gameIdRef={gameIdRef}
        gameStartedRef={gameStartedRef}
        timeRef={timeRef}
        state={state}
        onGoingGame={onGoingGame}
        username={username}
        setCanvas={setCanvas}
        bgImage={bgImage}
      />
    </>
  );
};

export default Game;
