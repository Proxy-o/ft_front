import { useEffect, useRef, useState, useCallback } from "react";
import useGameSocket from "../../hooks/sockets/useGameSocket";
import { canvasParams } from "../../types";
import useEndGame from "../../hooks/game/useEndGame";
import { draw } from "../../methods/draw";
import { movePaddlesOnline } from "../../methods/movePaddles";
import { changeBallDirectionOnline } from "../../methods/changeBallDirection";
import { checkLoseConditionOnline } from "../../methods/checkLoseCondition";
import { changeScoreOnline } from "../../methods/changeScore";
import checkCollisionWithHorizontalWalls from "../../methods/checkCollisionWithHorizontalWalls";
import { moveBall } from "../../methods/moveBall";
import { User } from "@/lib/types";
import { enemyLeftGame } from "../../methods/enemyLeftGame";

const Canvas = ({
  onGoingGame,
  leftUser,
  rightUser,
  gameIdRef,
  user,
  state,
  rightScoreRef,
  leftScoreRef,
  controllerUser,
  username,
  gameStarted,
  setGameStarted,
  canvasRef,
}: {
  onGoingGame: any;
  leftUser: React.MutableRefObject<User | undefined>;
  rightUser: React.MutableRefObject<User | undefined>;
  gameIdRef: React.MutableRefObject<string>;
  user: User | undefined;
  state: React.MutableRefObject<string>;
  rightScoreRef: React.MutableRefObject<number>;

  leftScoreRef: React.MutableRefObject<number>;
  controllerUser: React.MutableRefObject<User | undefined>;
  username: string;
  gameStarted: boolean;
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
}) => {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  const {
    handleMovePaddle,
    handleChangeBallDirection,
    handleEnemyScore,
    handleStartGame,
    handleTime,
    handleEndGame,
  } = useGameSocket();

  const { gameMsg } = useGameSocket();

  const canvasWidth = useRef<number>(1200);
  const canvasHeight = useRef<number>(canvasWidth.current / 2);
  const ballInLeftPaddle = useRef<boolean>(false);
  const ballInRightPaddle = useRef<boolean>(false);
  const enemyLeftGameRef = useRef<boolean>(false);
  const animationFrameId = useRef<number>(0);
  const isAnimating = useRef<boolean>(false);
  const isFirstTime = useRef<boolean>(true);
  const paddleLeftYRef = useRef<number>(0);
  const PaddleRightYRef = useRef<number>(0);
  const paddleRightDirectionRef = useRef<string>("stop");
  const nextAngleRef = useRef<number>(0);
  const newBallPositionRef = useRef({
    x: canvasWidth.current / 2,
    y: canvasHeight.current / 2,
  });
  const newAngleRef = useRef<number>(100);
  const upPressedRef = useRef<boolean>(false);
  const downPressedRef = useRef<boolean>(false);
  const timeRef = useRef<number>(0);
  const { mutate: endGame } = useEndGame();

  const changeTime = useCallback((Time: number) => {
    timeRef.current = Time;
  }, []);

  const paddleHeight = 120;
  const paddleWidth = 21;
  let ballRadius = 30;
  if (!gameStarted) canvasRef.current = null;

  const canvasParams: canvasParams = {
    canvas,
    canvasWidth,
    canvasHeight,
    paddleRightX: 0,
    newAngleRef,
    canvasRef,
    paddleLeftX: 0,
    nextAngleRef,
    paddleLeftYRef,
    PaddleRightYRef,
    enemyLeftGameRef,
    paddleRightDirectionRef,
    newBallPositionRef,
    ballInLeftPaddle,
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
  const handleKeyEvent = useCallback(
    (e: KeyboardEvent) => {
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
    },
    [handleMovePaddle]
  );

  useEffect(() => {
    if (canvas === null && canvasRef.current && gameStarted) {
      setCanvas(canvasRef.current);
    }
    if (!gameStarted && canvas !== null) {
      setCanvas(null);
    }
    if (canvas === null) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const paddleLeftX = 0;
    const paddleRightX = canvas.width - paddleWidth;
    paddleLeftYRef.current = (canvas.height - paddleHeight) / 2;
    PaddleRightYRef.current = (canvas.height - paddleHeight) / 2;

    isFirstTime.current = true;
    rightScoreRef.current = 0;
    leftScoreRef.current = 0;

    canvasParams.paddleRightX = paddleRightX;
    canvasParams.paddleLeftX = paddleLeftX;

    document.addEventListener("keydown", handleKeyEvent, false);
    document.addEventListener("keyup", handleKeyEvent, false);

    const returnFunction = () => {
      document.removeEventListener("keydown", handleKeyEvent, false);
      document.removeEventListener("keyup", handleKeyEvent, false);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      isAnimating.current = false;
    };

    const theGameStarted = () => {
      if (!gameStarted || canvas === null) return;
      if (
        username === controllerUser.current?.username &&
        newAngleRef.current === 100
      ) {
        newAngleRef.current = 10;
        newBallPositionRef.current = {
          x: canvasWidth.current / 2,
          y: canvasHeight.current / 2,
        };
        setTimeout(() => {
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
            rightUser.current?.username || "",
            leftUser.current?.username || ""
          );
        }, 1000);
      }

      changeBallDirectionOnline(
        canvasParams,
        newAngleRef,
        ballInLeftPaddle,
        ballInRightPaddle,
        handleChangeBallDirection,
        rightUser.current,
        leftUser.current
      );

      draw(canvasParams, ctx);

      checkCollisionWithHorizontalWalls(
        canvas,
        ballRadius,
        newBallPositionRef,
        newAngleRef
      );

      if (
        newAngleRef.current !== 100 &&
        newAngleRef.current !== 10 &&
        leftScoreRef.current < 3 &&
        rightScoreRef.current < 3
      ) {
        moveBall(canvasParams, user, leftUser.current, newAngleRef);
      }

      movePaddlesOnline(canvasParams);

      checkLoseConditionOnline(
        canvas,
        leftScoreRef,
        rightScoreRef,
        leftUser.current,
        rightUser.current,
        endGame,
        handleEndGame,
        setCanvas
      );

      changeScoreOnline(
        canvasParams,
        newAngleRef,
        handleChangeBallDirection,
        handleEnemyScore,
        rightUser.current,
        leftUser.current
      );
      if (leftScoreRef.current < 3 && rightScoreRef.current < 3) {
        enemyLeftGame(
          canvasParams,
          timeRef,
          enemyLeftGameRef,
          handleTime,
          endGame,
          state
        );
      }
    };

    const animate = () => {
      if (canvas === null || !gameStarted) return;
      if (
        gameStarted &&
        leftUser.current !== undefined &&
        rightUser.current !== undefined
      ) {
        theGameStarted();
      }
      animationFrameId.current = requestAnimationFrame(animate);
    };

    if (!isAnimating.current) {
      isAnimating.current = true;
      animate();
    }

    return returnFunction;
  }, [gameStarted, canvasRef.current]);

  useEffect(() => {
    const gameMsge = gameMsg();
    if (gameMsge) {
      const parsedMessage = JSON.parse(gameMsge.data);
      console.log(parsedMessage.message);
      const message = parsedMessage?.message.split(" ");

      if (message[0] === "/move") {
        const sender = message[3];
        if (sender !== leftUser.current?.username) {
          paddleRightDirectionRef.current = message[1];
          PaddleRightYRef.current = parseInt(message[2]);
        }
      } else if (message[0] === "/ballDirection") {
        const right = message[4];
        const angle = parseFloat(message[3]);
        if (
          canvasRef.current &&
          (newBallPositionRef.current.x < canvasRef.current.width / 6 ||
            newBallPositionRef.current.x > (canvasRef.current.width * 5) / 6)
        ) {
          isFirstTime.current = false;
        }
        if (right === leftUser.current?.username) {
          newBallPositionRef.current = {
            x: parseInt(message[1]),
            y: parseInt(message[2]),
          };
          newAngleRef.current = angle;
        } else {
          newBallPositionRef.current = {
            x: canvasWidth.current - parseInt(message[1]),
            y: parseInt(message[2]),
          };
          if (angle) newAngleRef.current = Math.PI - angle;
          else newAngleRef.current = angle;
        }
        if (angle == 100) {
          newAngleRef.current = 100;
        }
      } else if (message[0] === "/show") {
        // console.log("showing");
        if (!gameStarted) {
          handleStartGame(
            leftUser.current?.username || "",
            rightUser.current?.username || "",
            gameIdRef.current
          );
          changeTime(0);
          setGameStarted(true);
          newBallPositionRef.current = {
            x: canvasWidth.current / 2,
            y: canvasHeight.current / 2,
          };
          newAngleRef.current = 100;
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
        if (message[2] !== leftUser.current?.username) {
          changeTime(parseInt(message[1]));
          enemyLeftGameRef.current = false; // todo: tournament forfeit status
        }
      } else if (message[0] === "/surrender") {
        if (message[1] !== leftUser.current?.username) {
          state.current = "surrendered";
        }
        onGoingGame.refetch();
      } else if (message[0] === "/endGame") {
        if (message[1] !== leftUser.current?.username) {
          state.current = "win";
        } else {
          state.current = "lose";
        }
        // alert("Game Ended");
        leftScoreRef.current = 0;
        rightScoreRef.current = 0;
        setGameStarted(false);
        onGoingGame.refetch();
      }
    }
  }, [gameMsg()?.data]);

  return (
    <>
      {leftUser.current?.username &&
        rightUser.current?.username &&
        gameStarted && (
          <canvas
            ref={canvasRef}
            height={canvasHeight.current}
            width={canvasWidth.current}
            className="w-full h-full z-40"
          />
        )}
    </>
  );
};

export default Canvas;
