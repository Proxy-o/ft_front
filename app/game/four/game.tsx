import { useEffect, useRef, useState } from "react";
import { changeBallDirectionFour } from "../methods/changeBallDirection";
import { canvasParamsFour } from "../types";
import { checkLoseConditionFour } from "../methods/checkLoseCondition";
import { changeScoreFour } from "../methods/changeScore";
import checkCollisionWithHorizontalWalls from "../methods/checkCollisionWithHorizontalWalls";
import { moveBallFour } from "../methods/moveBall";
import { movePaddlesFour } from "../methods/movePaddles";
import { drawFour } from "../methods/draw";
import useGameSocket from "@/lib/hooks/useGameSocket";
import { User } from "@/lib/types";
import useGetFourGame from "../hooks/useGetFourGame";
import getCookie from "@/lib/functions/getCookie";
import useGetUser from "@/app/profile/hooks/useGetUser";
import useEndGameFour from "../hooks/useEndGameFour";
import Players from "../components/players";
import Actions from "../components/actions";

const Game = ({ type }: { type: string }) => {
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
  const gameStartedRef = useRef(false);
  const clickedRef = useRef(false);
  const upPressedRef = useRef(false);
  const downPressedRef = useRef(false);

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  const {
    newNotif,
    handleStartGameFour,
    handleSurrenderFour,
    handleMovePaddle,
    handleChangeBallDirectionFour,
    handleEnemyScoreFour,
    handleRefetchPlayers,
    handleReadyFour,
    handleReadyToStartFour,
  } = useGameSocket();
  const user_id = getCookie("user_id") || "";
  const { data: user } = useGetUser(user_id || "0");
  const username: string = user?.username || "";
  const { mutate: endGameFour } = useEndGameFour();

  const { onGoingGame } = useGetFourGame(user_id || "0");

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
    const notif = newNotif();
    if (notif) {
      const parsedMessage = JSON.parse(notif.data);
      const message = parsedMessage?.message.split(" ");
      // console.log(parsedMessage.message);
      if (message[0] === "/showFour") {
        const sender = message[1];
        const receiver = message[2];
        console.log(sender, receiver);
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
        }
      } else if (message[0] === "/move") {
        const paddleY = parseInt(message[1]);
        const playerMoved = message[2];
        if (playerMoved !== username) {
          if (
            playerMoved === leftUserTop?.username &&
            paddleY !== paddleLeftTopYRef.current
          ) {
            paddleLeftTopYRef.current = paddleY;
          } else if (
            playerMoved === leftUserBottom?.username &&
            paddleY !== paddleLeftBottomYRef.current
          ) {
            paddleLeftBottomYRef.current = paddleY;
          } else if (
            playerMoved === rightUserTop?.username &&
            paddleY !== paddleRightTopYRef.current
          ) {
            paddleRightTopYRef.current = paddleY;
          } else if (
            playerMoved === rightUserBottom?.username &&
            paddleY !== paddleRightBottomYRef.current
          ) {
            paddleRightBottomYRef.current = paddleY;
          }
        }
      } else if (message[0] === "/startFour") {
        gameStartedRef.current = true;
        playerReadyRef.current = 0;
      } else if (message[0] === "/start") {
        // invitaionsData.refetch();
        onGoingGame.refetch();
        handleRefetchPlayers();
        isFirstTime.current = true;
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
        } else {
          leftScoreRef.current = score;
        }
      } else if (message[0] === "/end") {
        onGoingGame.refetch();
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

    const paddleHeight = 50;
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
      }
      // else if (e.type === "keyup") {
      //   if (e.key === "ArrowUp") {
      //     upPressed = false;
      //   } else if (e.key === "ArrowDown") {
      //     downPressed = false;
      //   }
      // }
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
      if (gameStartedRef.current) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawFour(canvasParams);

        // move paddles
        movePaddlesFour(
          canvasParams,
          handleMovePaddle,
          leftUserTop,
          leftUserBottom,
          rightUserTop,
          rightUserBottom,
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
        // checkLoseConditionFour(
        //   canvas,
        //   leftScoreRef,
        //   rightScoreRef,
        //   gameStartedRef,
        //   leftUserTop,
        //   leftUserBottom,
        //   rightUserTop,
        //   rightUserBottom,
        //   endGameFour,
        //   username
        // );

        // Change score
        changeScoreFour(
          canvasParams,
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
            console.log("clicked");
            handleStartGameFour(
              username,
              onGoingGame.data?.game?.user1?.username || "",
              onGoingGame.data?.game?.user3?.username || "",
              onGoingGame.data?.game?.user2?.username || "",
              onGoingGame.data?.game?.user4?.username || ""
            );
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

    // return returnFunction;
  }, [canvas, onGoingGame.data?.game.user1]);

  return (
    <>
      <Players
        topLeft={leftUserTop}
        topRight={rightUserTop}
        bottomLeft={leftUserBottom}
        bottomRight={rightUserBottom}
        username={username}
      />
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="border-2 border-black"
      ></canvas>
      <Actions gameStarted={gameStartedRef.current} type={type} />
    </>
  );
};

export default Game;
