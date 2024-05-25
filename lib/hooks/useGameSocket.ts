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

  const handleMovePaddle = (paddleY: number, user: string, sender: string) => {
    const toSend = "/move " + paddleY + " " + user + " " + sender;
    sendJsonMessage({ message: toSend });
  };

  const handleMovePaddleFour = (
    paddleY: number,
    user: string,
    leftTop: string,
    leftBottom: string,
    rightTop: string,
    rightBottom: string
  ) => {
    const toSend =
      "/fourMove " +
      paddleY +
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
    user: string,
    leftTop: string,
    leftBottom: string,
    rightTop: string,
    rightBottom: string
  ) => {
    const toSend =
      "/fourChangeBallDirection " +
      ballX +
      " " +
      ballY +
      " " +
      angle +
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

  const handleEnemyScore = (
    user1: string,
    score1: number,
    user2: string,
    score2: number
  ) => {
    const toSend =
      "/enemyScore " + user1 + " " + score1 + " " + user2 + " " + score2;
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

  return {
    gameMsg,
    handleMovePaddle,
    handleChangeBallDirection,
    handleEnemyScore,
    handleMovePaddleFour,
    handleChangeBallDirectionFour,
    handleEnemyScoreFour,
  };
}
