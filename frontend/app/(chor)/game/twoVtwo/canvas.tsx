import { useEffect, useRef, useState } from "react";
import { enemyLeftGameFour } from "../methods/enemyLeftGame";
import checkCollisionWithHorizontalWalls from "../methods/checkCollisionWithHorizontalWalls";
import { checkLoseConditionFour } from "../methods/checkLoseCondition";
import { changeScoreFour } from "../methods/changeScore";
import { changeBallDirectionFour } from "../methods/changeBallDirection";
import { movePaddlesFour } from "../methods/movePaddles";
import { drawFour } from "../methods/draw";
import useGameSocket from "../hooks/sockets/useGameSocket";
import useInvitationSocket from "../hooks/sockets/useInvitationSocket";
import { User } from "@/lib/types";
import { canvasParamsFour } from "../types";
import { moveBallFour } from "../methods/moveBall";
import useEndGameFour from "../hooks/useEndGameFour";

const Canvas = ({
  leftUserTop,
  leftUserBottom,
  rightUserTop,
  rightUserBottom,
  gameId,
  gameStarted,
  setGameStarted,
  onGoingGame,
  username,
  state,
  playerReadyRef,
}: {
  leftUserTop: React.MutableRefObject<User>;
  leftUserBottom: React.MutableRefObject<User>;
  rightUserTop: React.MutableRefObject<User>;
  rightUserBottom: React.MutableRefObject<User>;
  gameId: string;
  gameStarted: boolean;
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
  onGoingGame: any;
  username: string;
  state: React.MutableRefObject<string>;
  playerReadyRef: React.MutableRefObject<number>;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef(0);
  const isAnimating = useRef(false);
  const upPressedRef = useRef(false);
  const downPressedRef = useRef(false);

  const newBallPositionRef = useRef({ x: 400, y: 200 });
  const newAngleRef = useRef(0);
  const isFirstTime = useRef(true);

  const myPaddleRef = useRef(0);

  const paddleRightTopYRef = useRef(0);
  const paddleRightBottomYRef = useRef(0);
  const paddleLeftTopYRef = useRef(0);
  const paddleLeftBottomYRef = useRef(0);

  const paddleRightTopDirectionRef = useRef("stop");
  const paddleRightBottomDirectionRef = useRef("stop");
  const paddleLeftTopDirectionRef = useRef("stop");
  const paddleLeftBottomDirectionRef = useRef("stop");

  const enemyLeftGameRef = useRef(false);
  const timeRef = useRef(0);
  const numberOfTimeResponseRef = useRef(0);
  const stillPlayingUsersRef = useRef<string[]>([]);
  const leftScoreRef = useRef<number>(0);
  const rightScoreRef = useRef<number>(0);

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  const {
    gameMsg,
    handleMovePaddleFour,
    handleChangeBallDirectionFour,
    handleEnemyScoreFour,
    handleTimeFour,
    handleTimeResponse,
    handleWhoLeftGame,
    handleUserLeftGame,
    handleStillPlaying,
    handleReadyToStartFour,
    handleReadyFour,
  } = useGameSocket();

  const { handleRefetchPlayers } = useInvitationSocket();

  const { mutate: endGameFour } = useEndGameFour();

  leftScoreRef.current = onGoingGame.data?.game.user1_score || 0;
  rightScoreRef.current = onGoingGame.data?.game.user2_score || 0;
  useEffect(() => {
    setCanvas(canvasRef.current);
    if (canvas === null) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return; // Exit if context is not available

    let ballInLeftPaddle = false;
    let ballInRightPaddle = false;

    let ballRadius = 10;

    const paddleHeight = 50;
    const paddleWidth = 10;
    paddleRightTopYRef.current = (canvas.height - paddleHeight) / 4;
    paddleLeftTopYRef.current = (canvas.height - paddleHeight) / 4;
    paddleLeftBottomYRef.current = ((canvas.height - paddleHeight) * 3) / 4;
    paddleRightBottomYRef.current = ((canvas.height - paddleHeight) * 3) / 4;

    if (username === rightUserTop.current?.username)
      myPaddleRef.current = paddleRightTopYRef.current;
    if (username === rightUserBottom.current?.username)
      myPaddleRef.current = paddleRightBottomYRef.current;
    if (username === leftUserTop.current?.username)
      myPaddleRef.current = paddleLeftTopYRef.current;
    if (username === leftUserBottom.current?.username)
      myPaddleRef.current = paddleLeftBottomYRef.current;

    const paddleLeftX = 0;
    const paddleRightX = canvas.width - paddleWidth;

    const handleKeyEvent = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
      }
      if (e.type === "keydown") {
        if (e.key === "ArrowUp" && !upPressedRef.current) {
          upPressedRef.current = true;
          downPressedRef.current = false;
          handleMovePaddleFour(myPaddleRef.current, "up", username);
        } else if (e.key === "ArrowDown" && !downPressedRef.current) {
          downPressedRef.current = true;
          upPressedRef.current = false;
          handleMovePaddleFour(myPaddleRef.current, "down", username);
        }
      } else if (e.type === "keyup") {
        if (e.key === "ArrowUp") {
          upPressedRef.current = false;
          handleMovePaddleFour(myPaddleRef.current, "stop", username);
        } else if (e.key === "ArrowDown") {
          downPressedRef.current = false;
          handleMovePaddleFour(myPaddleRef.current, "stop", username);
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
      paddleLeftTopDirectionRef,
      paddleLeftBottomDirectionRef,
      paddleRightTopDirectionRef,
      paddleRightBottomDirectionRef,
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
      gameId,
    };

    setTimeout(() => {
      if (
        username === leftUserTop.current?.username &&
        newAngleRef.current === 0
      ) {
        // y = Math.random() * (canvas.height - ballRadius * 2) + ballRadius;
        // newBallPositionRef.current = { x, y }; // Initialize the ref
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
          username
        );
      }
    }, 1000);
    const drawOnlineOne = () => {
      if (canvas === null) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the paddles
      drawFour(canvasParams);

      // move paddles
      movePaddlesFour(
        canvasParams,
        username,
        myPaddleRef,
        upPressedRef,
        downPressedRef
      );

      // Check for collision with left paddle
      changeBallDirectionFour(
        canvasParams,
        newAngleRef,
        ballInLeftPaddle,
        myPaddleRef,
        paddleRightX,
        ballInRightPaddle,
        handleChangeBallDirectionFour,
        username
      );

      // Change score
      changeScoreFour(
        canvasParams,
        newAngleRef,
        handleChangeBallDirectionFour,
        handleEnemyScoreFour,
        username
      );

      // Check for score
      checkLoseConditionFour(
        canvasParams,
        canvas,
        leftScoreRef,
        rightScoreRef,
        setGameStarted,
        endGameFour,
        username,
        handleRefetchPlayers,
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
        leftScoreRef.current < 3 &&
        rightScoreRef.current < 3
      ) {
        moveBallFour(canvasParams, newAngleRef);
      }

      // Check if enemy has left the game
      enemyLeftGameFour(
        canvasParams,
        timeRef,
        enemyLeftGameRef,
        gameStarted,
        setGameStarted,
        handleTimeFour,
        handleWhoLeftGame,
        username
      );
    };

    const animate = () => {
      if (canvas === null || !gameStarted) {
        return;
      }

      if (
        gameStarted &&
        leftUserTop.current.username &&
        leftUserBottom.current.username &&
        rightUserTop.current.username &&
        rightUserBottom.current.username
      ) {
        drawOnlineOne();
      }
      animationFrameId.current = requestAnimationFrame(animate);
    };

    if (!isAnimating.current) {
      isAnimating.current = true;
      animate();
      return returnFunction;
    }
  }, [canvas, gameStarted, canvasRef.current]);

  useEffect(() => {
    if (gameMsg()) {
      const gameMsge = gameMsg()?.data;
      const parsedMessage = JSON.parse(gameMsge);
      console.log(parsedMessage);
      const message = parsedMessage.message.split(" ");
      if (message[0] === "/showFour") {
        const sender = message[1];
        const receiver = message[2];
        timeRef.current = 0;
        newAngleRef.current = 0;
        newBallPositionRef.current = {
          x: (canvasRef.current?.width || 800) / 2,
          y: (canvasRef.current?.height || 400) / 2,
        };
        enemyLeftGameRef.current = false;
        isFirstTime.current = true;
        playerReadyRef.current = 0;
        stillPlayingUsersRef.current = [];
        handleReadyFour(sender, receiver);
      } else if (message[0] === "/readyFour") {
        playerReadyRef.current += 1;
        if (playerReadyRef.current === 4) {
          handleReadyToStartFour(
            leftUserTop.current?.username || "",
            leftUserBottom.current?.username || "",
            rightUserTop.current?.username || "",
            rightUserBottom.current?.username || ""
          );
        }
      } else if (message[0] === "/fourMove") {
        const paddleY = parseInt(message[1]);
        const direction = message[2];
        const playerMoved = message[3];
        if (playerMoved !== username) {
          if (playerMoved === leftUserTop.current?.username) {
            paddleLeftTopDirectionRef.current = direction;
            paddleLeftTopYRef.current = paddleY;
          } else if (playerMoved === leftUserBottom.current?.username) {
            paddleLeftBottomDirectionRef.current = direction;
            paddleLeftBottomYRef.current = paddleY;
          } else if (playerMoved === rightUserTop.current?.username) {
            paddleRightTopDirectionRef.current = direction;
            paddleRightTopYRef.current = paddleY;
          } else if (playerMoved === rightUserBottom.current?.username) {
            paddleRightBottomDirectionRef.current = direction;
            paddleRightBottomYRef.current = paddleY;
          }
        }
      } else if (message[0] === "/score") {
        isFirstTime.current = true;
        onGoingGame.refetch();
      } else if (message[0] === "/fourBallDirection") {
        const sender = message[4];
        if (sender !== username) {
          newBallPositionRef.current = {
            x: parseInt(message[1]),
            y: parseInt(message[2]),
          };
          newAngleRef.current = parseFloat(message[3]);
          if (
            canvasRef.current &&
            (newBallPositionRef.current.x < canvasRef.current.width / 6 ||
              newBallPositionRef.current.x > (canvasRef.current.width * 5) / 6)
          ) {
            isFirstTime.current = false;
          }
        }
      } else if (message[0] === "/startFour") {
        setGameStarted(true);
        onGoingGame.refetch();
      } else if (message[0] === "/timeResponse") {
        const user = message[2];
        if (user === username) {
          const time = parseInt(message[1]);
          numberOfTimeResponseRef.current += 1;
          if (numberOfTimeResponseRef.current === 4) {
            timeRef.current = time;
            enemyLeftGameRef.current = false;
            numberOfTimeResponseRef.current = 0;
          }
        }
      } else if (message[0] === "/fourTime") {
        if (gameStarted) {
          handleTimeResponse(parseInt(message[1]), message[2]);
        } else if (message[0] === "/whoLeftGame") {
          const whoAsked = message[1];
          handleStillPlaying(username, whoAsked);
        } else if (message[0] === "/fourSurrender") {
          const surrenderer = message[1];
          if (surrenderer !== username) {
            if (
              username === leftUserTop.current.username ||
              username === leftUserBottom.current.username
            ) {
              if (
                surrenderer === rightUserTop.current.username ||
                surrenderer === rightUserBottom.current.username
              ) {
                state.current = "surrendered";
              } else {
                state.current = "surrender";
              }
            } else {
              if (
                surrenderer === leftUserTop.current.username ||
                surrenderer === leftUserBottom.current.username
              ) {
                state.current = "surrendered";
              } else {
                state.current = "surrender";
              }
            }
          }
          setGameStarted(false);
          onGoingGame.refetch();
        } else if (message[0] === "/stillPlaying") {
          const user = message[1];
          const whoAsked = message[2];
          if (whoAsked === username) {
            stillPlayingUsersRef.current.push(user);
            // handleWhoLeftGame();
            if (stillPlayingUsersRef.current.length === 4) {
              // find the user who did not respond
              if (
                leftUserTop.current.username &&
                leftUserBottom.current.username &&
                rightUserTop.current.username &&
                rightUserBottom.current.username
              ) {
                const userWhoDidNotRespond = [
                  leftUserTop.current.username,
                  leftUserBottom.current.username,
                  rightUserTop.current.username,
                  rightUserBottom.current.username,
                ];
                stillPlayingUsersRef.current.forEach((user) => {
                  const index = userWhoDidNotRespond.indexOf(user);
                  if (index > -1) {
                    userWhoDidNotRespond.splice(index, 1);
                  }
                });
                handleUserLeftGame(userWhoDidNotRespond[0] || "");
                const winner =
                  leftUserTop.current.username === userWhoDidNotRespond[0] ||
                  leftUserBottom.current.username === userWhoDidNotRespond[0]
                    ? rightUserTop.current.id
                    : leftUserTop.current.id;
                const loser =
                  leftUserTop.current.username === userWhoDidNotRespond[0] ||
                  leftUserBottom.current.username === userWhoDidNotRespond[0]
                    ? leftUserTop.current.id
                    : rightUserTop.current.id;
                // alert("3");
                endGameFour({
                  winner,
                  winnerScore: 3,
                  loser,
                  loserScore: 0,
                });
              }
            }
          }
        } else if (message[0] === "/userLeftGame") {
          onGoingGame.refetch();
        } else if (message[0] === "/end") {
          leftScoreRef.current = 0;
          rightScoreRef.current = 0;
          setGameStarted(false);
          newAngleRef.current = 0;
          onGoingGame.refetch();
        }
      }
    }
  }, [gameMsg()]);

  return (
    <>
      {gameStarted && (
        <>
          <canvas
            ref={canvasRef}
            height="400"
            width="800"
            className={`w-full md:w-5/6  max-w-[800px] bg-black border-2 border-white mx-auto`}
          ></canvas>
        </>
      )}
    </>
  );
};

export default Canvas;
