import { useEffect } from "react";
import useGameSocket from "../hooks/useGameSocket";
import useInvitationSocket from "../hooks/useInvitationSocket";
import { User } from "@/lib/types";

const Sockets = (
    { 
        canvasRef,
        PaddleRightYRef,
        newBallPositionRef,
        newAngleRef,
        isFirstTime,
        ballInLeftPaddle,
        upPressedRef,
        downPressedRef,
        paddleRightDirectionRef,
        leftScoreRef,
        rightScoreRef,
        enemyLeftGameRef,
        leftUser,
        rightUser,
        gameIdRef,
        gameStartedRef,
        state,
        changeTime,
        onGoingGame,
        username,
        setCanvas,
        bgImage,
    } : {
        canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
        PaddleRightYRef: React.MutableRefObject<number>,
        newBallPositionRef: React.MutableRefObject<{x: number, y: number}>,
        newAngleRef: React.MutableRefObject<number>,
        isFirstTime: React.MutableRefObject<boolean>,
        ballInLeftPaddle: React.MutableRefObject<boolean>,
        paddleRightDirectionRef: React.MutableRefObject<string>,
        upPressedRef: React.MutableRefObject<boolean>,
        downPressedRef: React.MutableRefObject<boolean>,
        leftScoreRef: React.MutableRefObject<number>,
        rightScoreRef: React.MutableRefObject<number>,
        enemyLeftGameRef: React.MutableRefObject<boolean>,
        leftUser: React.MutableRefObject<User | undefined>,
        rightUser: React.MutableRefObject<User | undefined>,
        gameIdRef: React.MutableRefObject<string>,
        changeTime: (time: number) => void,
        gameStartedRef: React.MutableRefObject<boolean>,
        state: React.MutableRefObject<string>,
        onGoingGame: any,
        username: string,
        setCanvas: React.Dispatch<React.SetStateAction<HTMLCanvasElement | null>>,
        bgImage: React.MutableRefObject<HTMLImageElement | null>,
    }
) => {
    const {
    gameMsg,
    handleStartGame,
  } = useGameSocket();
  useEffect(() => {
    const gameMsge = gameMsg();
    if (gameMsge) {
      const parsedMessage = JSON.parse(gameMsge.data);
      console.log(parsedMessage.message);
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
        if (!gameStartedRef.current) {
          handleStartGame(
            leftUser.current?.username || "",
            rightUser.current?.username || "",
            gameIdRef.current
          );
          changeTime(0);
          gameStartedRef.current = true;
          newBallPositionRef.current = { x: 20000, y: 20000 };
          newAngleRef.current = 0;
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
        isFirstTime.current = true;
        onGoingGame.refetch();
      } else if (message[0] === "/time") {
        if (message[2] !== username) {
          changeTime(parseInt(message[1]));
          enemyLeftGameRef.current = false; // todo: tournament forfeit status
        }
      } else if (message[0] === "/refetchPlayers") {
        onGoingGame.refetch();
      } else if (message[0] === "/surrender") {
        if (message[1] !== username) {
          state.current = "surrendered";
        } else {
          state.current = "none";
        }
        gameStartedRef.current = false;
        setCanvas(null);
        onGoingGame.refetch();
      } else if (message[0] === "/end") {
        if (leftScoreRef.current >= 3) {
          state.current = "win";
        } else if (rightScoreRef.current < 3) {
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

  


  return (
    <></>
  );
}

export default Sockets;