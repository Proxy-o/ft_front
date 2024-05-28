import getCookie from "@/lib/functions/getCookie";
import useWebSocket from "react-use-websocket";

export default function useGameSocket() {
  const user_id = getCookie("user_id");
  const token = getCookie("refresh");
  const socketUrl = process.env.NEXT_PUBLIC_GAME_URL + "/?refresh=" + token;

  const { sendJsonMessage, lastMessage } = useWebSocket(socketUrl);

  const gameMsg = () => {
    return lastMessage;
  };

  const handleStartGame = (user1: string, user2: string, game_id: string) => {
    const toSend = "/debut " + user1 + " " + user2 + " " + game_id;
    // console.log(toSend);
    sendJsonMessage({ message: toSend });
  };

  const handleMovePaddle = (paddleY: number) => {
    const toSend = "/move " + paddleY;
    sendJsonMessage({ message: toSend });
  };

  const handleMovePaddleFour = (paddleY: number, user: string) => {
    const toSend = "/fourMove " + paddleY + " " + user;
    sendJsonMessage({ message: toSend });
  };

  const handleChangeBallDirection = (
    ballX: number,
    ballY: number,
    angle: number,
    user: string
  ) => {
    const toSend =
      "/changeBallDirection " + ballX + " " + ballY + " " + angle + " " + user;
    sendJsonMessage({ message: toSend });
  };

  const handleChangeBallDirectionFour = (
    ballX: number,
    ballY: number,
    angle: number,
    user: string
  ) => {
    const toSend =
      "/fourChangeBallDirection " +
      ballX +
      " " +
      ballY +
      " " +
      angle +
      " " +
      user;
    sendJsonMessage({ message: toSend });
  };

  const handleEnemyScore = (score: number) => {
    const toSend = "/enemyScore " + score;
    sendJsonMessage({ message: toSend });
  };

  const handleEnemyScoreFour = (
    newScore: number,
    user: string,
    leftTop: string,
    leftBottom: string,
    rightTop: string,
    rightBottom: string
  ) => {
    const toSend =
      "/fourEnemyScore " +
      newScore +
      " " +
      user +
      " " +
      leftTop +
      " " +
      leftBottom +
      " " +
      rightTop +
      " " +
      rightBottom;
    sendJsonMessage({ message: toSend });
  };

  const handleTime = (time: number) => {
    const toSend = "/time " + time;
    sendJsonMessage({ message: toSend });
  };

  const handleDisconnect = () => {
    sendJsonMessage({ message: "/disconnect" });
  };

  return {
    gameMsg,
    handleStartGame,
    handleMovePaddle,
    handleChangeBallDirection,
    handleEnemyScore,
    handleMovePaddleFour,
    handleChangeBallDirectionFour,
    handleEnemyScoreFour,
    handleTime,
    handleDisconnect,
  };
}
