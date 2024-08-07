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
        leftScoreRef,
        rightScoreRef,
        enemyLeftGameRef,
        leftUser,
        rightUser,
        gameIdRef,
        gameStartedRef,
        timeRef,
        state,
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
        upPressedRef: React.MutableRefObject<boolean>,
        downPressedRef: React.MutableRefObject<boolean>,
        leftScoreRef: React.MutableRefObject<number>,
        rightScoreRef: React.MutableRefObject<number>,
        enemyLeftGameRef: React.MutableRefObject<boolean>,
        leftUser: React.MutableRefObject<User | undefined>,
        rightUser: React.MutableRefObject<User | undefined>,
        gameIdRef: React.MutableRefObject<string>,
        gameStartedRef: React.MutableRefObject<boolean>,
        timeRef: React.MutableRefObject<number>,
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
  const { newNotif } = useInvitationSocket();
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
      } else if (message[0] === "/score") {
        isFirstTime.current = true;
        onGoingGame.refetch();
      } else if (message[0] === "/time") {
        if (message[2] !== username) {
          timeRef.current = parseInt(message[1]);
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
        onGoingGame.refetch();
      } else if (message[0] === "/end") {
        if (leftScoreRef.current >=3) {
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

  useEffect(() => {
    const notif = newNotif();
    if (notif) {
      const parsedMessage = JSON.parse(notif.data);
      const message = parsedMessage?.message.split(" ");
      console.log(parsedMessage.message);

      if (message[0] === "/start" || message[0] === "/refetchTournament") {
        onGoingGame.refetch();
      } else if (message[0] === "/end") {
        gameStartedRef.current = false;
        onGoingGame.refetch();
      }
    }
  }, [newNotif()?.data]);


  return (
    <div>
      <h1>Welcome to page Sockets</h1>
    </div>
  );
}

export default Sockets;