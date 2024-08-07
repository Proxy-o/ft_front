import { useEffect, useRef, useState } from "react";
import { changeBallDirectionFour } from "../methods/changeBallDirection";
import { canvasParamsFour } from "../types";
import { checkLoseConditionFour } from "../methods/checkLoseCondition";
import { changeScoreFour } from "../methods/changeScore";
import checkCollisionWithHorizontalWalls from "../methods/checkCollisionWithHorizontalWalls";
import { moveBallFour } from "../methods/moveBall";
import { movePaddlesFour } from "../methods/movePaddles";
import { drawFour } from "../methods/draw";
import useGameSocket from "@/app/(chor)/game/hooks/useGameSocket";
import { User } from "@/lib/types";
import getCookie from "@/lib/functions/getCookie";
import useEndGameFour from "../hooks/useEndGameFour";
import useInvitationSocket from "@/app/(chor)/game/hooks/useInvitationSocket";
import { enemyLeftGameFour } from "../methods/enemyLeftGame";
import useEndGame from "../hooks/useEndGame";
import useGetUser from "../../profile/hooks/useGetUser";
import NoGameFour from "../components/noGameFour";
import { Button } from "@/components/ui/button";
import useLeaveGame from "../hooks/useLeaveGame";
import useSurrenderGame from "../hooks/useSurrender";
import { DoorOpen, Flag, Gamepad } from "lucide-react";
import Hover from "../components/hover";
import { toast } from "sonner";
import PreGame from "../components/preGame";

const Game = ({
  gameStartedRef,
  setGameChange,
  onGoingGame,
  state,
}: {
  gameStartedRef: React.MutableRefObject<boolean>;
  setGameChange: React.Dispatch<React.SetStateAction<boolean>>;
  onGoingGame: any;
  state: React.MutableRefObject<string>;
}) => {
  const playerReadyRef = useRef(0);
  const isFirstTime = useRef(true);
  const paddleRightTopYRef = useRef(0);
  const paddleRightBottomYRef = useRef(0);
  const paddleLeftTopYRef = useRef(0);
  const paddleLeftBottomYRef = useRef(0);
  const myPaddleRef = useRef(0);
  const newBallPositionRef = useRef({ x: 0, y: 0 });
  const newAngleRef = useRef(0);
  const rightScoreRef = useRef(0);
  const leftScoreRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef(0);
  const isAnimating = useRef(false);
  const upPressedRef = useRef(false);
  const downPressedRef = useRef(false);
  const gameIdRef = useRef("");
  const timeRef = useRef(0);
  const enemyLeftGameRef = useRef(false);
  const numberOfTimeResponseRef = useRef(0);
  const stillPlayingUsersRef = useRef<string[]>([]);
  const dummyPlayer: User = {
    username: "player",
    avatar: "none",
    id: "",
  };

  if (!gameStartedRef.current) {
    timeRef.current = 0;
    newAngleRef.current = 0;
    enemyLeftGameRef.current = false;
  }
  const leftUserTop = useRef<User>(dummyPlayer);
  const leftUserBottom = useRef<User>(dummyPlayer);
  const rightUserTop = useRef<User>(dummyPlayer);
  const rightUserBottom = useRef<User>(dummyPlayer);

  const user_id = getCookie("user_id") || "";
  const { data: user } = useGetUser(user_id || "0");
  const username: string = user?.username || "";

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  const { mutate: surrenderGame } = useSurrenderGame();

  const { mutate: endGameFour } = useEndGameFour();

  const { mutate: leaveGame } = useLeaveGame();
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
  } = useGameSocket();

  const {
    newNotif,
    handleReadyFour,
    handleReadyToStartFour,
    handleRefetchPlayers,
    handleStartGameFour,
  } = useInvitationSocket();

  const { mutate: endGame } = useEndGame();

  leftUserTop.current = onGoingGame.data?.game?.user1 || dummyPlayer;
  leftUserBottom.current = onGoingGame.data?.game?.user3 || dummyPlayer;
  rightUserTop.current = onGoingGame.data?.game?.user2 || dummyPlayer;
  rightUserBottom.current = onGoingGame.data?.game?.user4 || dummyPlayer;
  gameIdRef.current = onGoingGame.data?.game.id || "";
  leftScoreRef.current = onGoingGame.data?.game.user1_score || 0;
  rightScoreRef.current = onGoingGame.data?.game.user2_score || 0;

  useEffect(() => {
    setCanvas(canvasRef.current);
    if (canvas === null) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return; // Exit if context is not available

    rightScoreRef.current = 0;
    leftScoreRef.current = 0;

    let ballInLeftPaddle = false;
    let ballInRightPaddle = false;

    let ballRadius = 10;
    let x = canvas.width / 2;
    let y = canvas.height / 2;

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
      gameIdRef,
    };

    const drawOnlineOne = () => {
      if (canvas === null) return;
      if (
        username === leftUserTop.current?.username &&
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
        handleChangeBallDirectionFour(
          newBallPositionRef.current.x,
          newBallPositionRef.current.y,
          newAngleRef.current,
          username
        );
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the paddles
      drawFour(canvasParams);

      // move paddles
      movePaddlesFour(
        canvasParams,
        handleMovePaddleFour,
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
        gameStartedRef,
        endGameFour,
        username,
        handleRefetchPlayers,
        setGameChange
      );

      // Check for collision with the horizontal walls
      checkCollisionWithHorizontalWalls(
        canvas,
        ballRadius,
        newBallPositionRef,
        newAngleRef
      );

      // Move the ball
      moveBallFour(canvasParams, newAngleRef);

      // Check if enemy has left the game
      enemyLeftGameFour(
        canvasParams,
        timeRef,
        enemyLeftGameRef,
        gameStartedRef,
        handleTimeFour,
        handleWhoLeftGame,
        username
      );
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

    return returnFunction;
  }, [
    canvas,
    gameStartedRef.current,
  ]);

  useEffect(() => {
    if (newNotif()) {
      const notif = newNotif();
      const parsedMessage = JSON.parse(notif?.data);
      const message = parsedMessage.message.split(" ");
      if (message[0] === "/showFour") {
        const sender = message[1];
        const receiver = message[2];
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
      } else if (message[0] === "/startFour") {
        timeRef.current = 0;
        newAngleRef.current = 0;
        enemyLeftGameRef.current = false;
        isFirstTime.current = true;
        gameStartedRef.current = true;
        playerReadyRef.current = 0;
        onGoingGame.refetch();
      } else if (message[0] === "/start") {
        // invitaionsData.refetch();
        onGoingGame.refetch();
        handleRefetchPlayers(onGoingGame.data?.game.user1.id || "");
        isFirstTime.current = true;
        // setStartCountdown(true);
      } else if (message[0] === "/refetchPlayers") {
        onGoingGame.refetch();
      }
    }
  }, [newNotif()?.data]);
  useEffect(() => {
    if (gameMsg()) {
      const gameMsge = gameMsg()?.data;
      const parsedMessage = JSON.parse(gameMsge);
      const message = parsedMessage.message.split(" ");
      if (message[0] === "/move") {
        const paddleY = parseInt(message[1]);
        const playerMoved = message[2];
        if (playerMoved !== username) {
          if (playerMoved === leftUserTop.current?.username) {
            paddleLeftTopYRef.current = paddleY;
          } else if (playerMoved === leftUserBottom.current?.username) {
            paddleLeftBottomYRef.current = paddleY;
          } else if (playerMoved === rightUserTop.current?.username) {
            paddleRightTopYRef.current = paddleY;
          } else if (playerMoved === rightUserBottom.current?.username) {
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
        if (gameStartedRef.current)
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
        onGoingGame.refetch();
        gameStartedRef.current = false;
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
              endGame({
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
        gameStartedRef.current = false;
        newAngleRef.current = 0;
        setGameChange(false);
        onGoingGame.refetch();
      }
    }
  }, [gameMsg()?.data]);
  return (
    <>
      {!gameStartedRef.current && (
        leftUserTop.current || leftUserBottom.current || rightUserTop.current || rightUserBottom.current ? (
          <PreGame
            leftUserTop={leftUserTop.current}
            leftUserBottom={leftUserBottom.current}
            rightUserTop={rightUserTop.current}
            rightUserBottom={rightUserBottom.current}
          />
        ) : (
          <NoGameFour state={state} />
        )
      )}
      {gameStartedRef.current && (
        <canvas
          ref={canvasRef}
          height="400"
          width="800"
          className={`w-full md:w-5/6  max-w-[800px] bg-black border-2 border-white mx-auto`}
        ></canvas>
      )}
      {!gameStartedRef.current ? (
        <div className="w-full flex flex-row justify-center items-center gap-4">
            <Button
              onClick={() => {
                playerReadyRef.current = 0;

                handleStartGameFour(
                  username,
                  leftUserTop.current?.username || "",
                  leftUserBottom.current?.username || "",
                  rightUserBottom.current?.username || "",
                  rightUserTop.current?.username || ""
                );
              }}
              className="h-full w-full"
            >
              <Gamepad size={25} />
            </Button>
            <Button
              onClick={() => {
                leaveGame();
                handleRefetchPlayers(onGoingGame.data?.game.id || "");
              }}
              className="h-full w-full"
            >
              <DoorOpen size={25} />
            </Button>
        </div>
      ) : (
          <Button
            onClick={() => {
              surrenderGame();
            }}
            className="h-full w-full"
          >
            <Flag size={25} />
            Surrender
          </Button>
      )}
    </>
  );
};

export default Game;
