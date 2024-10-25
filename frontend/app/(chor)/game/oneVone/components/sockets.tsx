import { useEffect } from "react";
import { canvasParams } from "../../types";
import useGameSocket from "../../hooks/sockets/useGameSocket";

const Sockets = ({
  canvasParams,
  handleStartGame,
  changeTime,
  setGameStarted,
  state,
  onGoingGame,
  gameStarted,
}: {
  canvasParams: canvasParams;
  handleStartGame: (
    leftUser: string,
    rightUser: string,
    gameId: string
  ) => void;
  changeTime: (time: number) => void;
  setGameStarted: (gameStarted: boolean) => void;
  state: React.MutableRefObject<string>;
  onGoingGame: any;
  gameStarted: boolean;
}) => {
  const {
    PaddleRightYRef,
    paddleRightDirectionRef,
    newBallPositionRef,
    ballInLeftPaddle,
    upPressedRef,
    downPressedRef,
    enemyLeftGameRef,
    newAngleRef,
    isFirstTime,
    nextAngleRef,
    canvasRef,
    leftScoreRef,
    rightScoreRef,
    leftUserRef: leftUser,
    rightUserRef: rightUser,
    gameIdRef,
  } = canvasParams;

  const { gameMsg } = useGameSocket();
  useEffect(() => {
    const gameMsge = gameMsg();
    if (gameMsge) {
      const parsedMessage = JSON.parse(gameMsge.data);
      //   console.log(parsedMessage.message);
      const message = parsedMessage?.message.split(" ");

      if (message[0] === "/move") {
        const sender = message[3];
        if (sender !== leftUser.current?.username) {
          paddleRightDirectionRef.current = message[1];
          PaddleRightYRef.current = parseInt(message[2]);
        }
      } else if (message[0] === "/ballDirection") {
        const sender = message[4];
        if (sender !== leftUser.current?.username) {
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
          if (isFirstTime.current) {
            newAngleRef.current = parseFloat(message[3]);
          } else {
            nextAngleRef.current = parseFloat(message[3]);
          }
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
        if (message[2] !== leftUser.current?.username) {
          changeTime(parseInt(message[1]));
          enemyLeftGameRef.current = false; // todo: tournament forfeit status
        }
      } else if (message[0] === "/surrender") {
        if (message[1] !== leftUser.current?.username) {
          state.current = "surrendered";
        } else {
          state.current = "none";
        }
        onGoingGame.refetch();
      } else if (message[0] === "/endGame") {
        if (message[1] !== leftUser.current?.username) {
          state.current = "lose";
        } else {
          state.current = "win";
        }
        leftScoreRef.current = 0;
        rightScoreRef.current = 0;
        onGoingGame.refetch();
      }
    }
  }, [gameMsg()?.data]);

  return <></>;
};

export default Sockets;
