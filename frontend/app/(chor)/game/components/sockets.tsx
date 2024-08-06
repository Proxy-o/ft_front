import { useEffect } from "react";
import useGameSocket from "../hooks/useGameSocket";
import useInvitationSocket from "../hooks/useInvitationSocket";

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
    } : any ) => {
    const {
    gameMsg,
    handleStartGame,
  } = useGameSocket();
  const { newNotif } = useInvitationSocket();
    useEffect(() => {
        const gameMsge = gameMsg();
        if (gameMsge) {
          const parsedMessage = JSON.parse(gameMsge.data);
          // console.log(parsedMessage.message);
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
              gameStartedRef.current = true;
              newBallPositionRef.current = { x: 20000, y: 20000 };
              newAngleRef.current = 0;
              isFirstTime.current = true;
              ballInLeftPaddle.current = false;
              upPressedRef.current = false;
              downPressedRef.current = false;
              leftScoreRef.current = 0;
              rightScoreRef.current = 0;
              enemyLeftGameRef.current = false
            }
            // onGoingGame.refetchr();
          } else if (message[0] === "/score") {
            isFirstTime.current = true;
            // onGoingGame.refetch();
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
            if (leftScoreRef.current == 3) {
              state.current = "win";
            } else if (rightScoreRef.current == 3) {
              state.current = "lose";
            } else {
              state.current = "none";
            }
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