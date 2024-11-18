import useGetUser from "@/app/(chor)/profile/hooks/useGetUser";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

export default function useGameSocket() {
  const [socketUrl, setSocketUrl] = useState<string | null>(null);
  const { data: user, isLoading } = useGetUser("0");

  useEffect(() => {
    if (!isLoading && user?.s_token) {
      setSocketUrl(
        process.env.NEXT_PUBLIC_GAME_URL +
          "/?user_id=" +
          user?.id +
          "&s_token=" +
          user?.s_token
      );
    }
  }, [isLoading, user]);
  const { sendJsonMessage, lastMessage } = useWebSocket(socketUrl, {
    share: true,
    shouldReconnect: () => !!socketUrl,
  });
  const gameMsg = () => {
    return lastMessage;
  };

  const handleStartGame = (user1: string, user2: string, game_id: string) => {
    // console.log("sending start game");
    const toSend = "/debut " + user1 + " " + user2 + " " + game_id;
    sendJsonMessage({ message: toSend });
  };

  const handleMovePaddle = (direction: string, paddleY: number) => {
    const toSend = "/move " + direction + " " + paddleY;
    sendJsonMessage({ message: toSend });
  };

  const handleEndGame = () => {
    const toSend = "/endGame ";
    sendJsonMessage({ message: toSend });
  };

  const handleMovePaddleFour = (
    paddleY: number,
    direction: string,
    user: string,
    player1: string,
    player2: string,
    player3: string
  ) => {
    const toSend =
      "/fourMove " +
      paddleY +
      " " +
      direction +
      " " +
      user +
      " " +
      player1 +
      " " +
      player2 +
      " " +
      player3;
    sendJsonMessage({ message: toSend });
  };

  const handleChangeBallDirection = (
    ballX: number,
    ballY: number,
    angle: number,
    user1: string,
    user2: string,
    user3?: string,
    user4?: string
  ) => {
    const toSend =
      "/changeBallDirection " +
      ballX +
      " " +
      ballY +
      " " +
      angle +
      " " +
      user1 +
      " " +
      user2;
    if (user3) toSend.concat(" " + user3);
    if (user4) toSend.concat(" " + user4);
    sendJsonMessage({ message: toSend });
  };

  const handleReadyToStartFour = (
    user1: string,
    user2: string,
    user3: string,
    user4: string
  ) => {
    // console.log("sending ready to start");
    const toSend =
      "/readyToStartFour " + user1 + " " + user2 + " " + user3 + " " + user4;
    sendJsonMessage({ message: toSend });
  };

  const handleChangeBallDirectionFour = (
    ballX: number,
    ballY: number,
    angle: number,
    user: string,
    enemiesRef: React.MutableRefObject<string[]>
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
      enemiesRef.current.join(" ");
    sendJsonMessage({ message: toSend });
  };

  const handleEnemyScore = (gameId: string) => {
    const toSend = "/enemyScore " + gameId;
    sendJsonMessage({ message: toSend });
  };

  const handleEnemyScoreFour = () => {
    const toSend = "/fourEnemyScore ";
    sendJsonMessage({ message: toSend });
  };

  const handleTime = (time: number) => {
    const toSend = "/time " + time;
    sendJsonMessage({ message: toSend });
  };

  const handleTimeFour = (time: number, user: string) => {
    const toSend = "/fourTime " + time + " " + user;
    sendJsonMessage({ message: toSend });
  };

  const handleTimeResponse = (time: number, user: string) => {
    const toSend = "/timeResponse " + time + " " + user;
    sendJsonMessage({ message: toSend });
  };

  const handleWhoLeftGame = () => {
    sendJsonMessage({ message: "/whoLeftGame" });
  };

  const handleUserLeftGame = (user: string, stillPlaying: string[]) => {
    sendJsonMessage({ message: "/userLeftGame " + user + " " + stillPlaying.join(" ") });
  };

  const handleSurrenderFour = (gameid: string) => {
    const toSend = "/fourSurrender " + gameid;
    sendJsonMessage({ message: toSend });
  };

  const handleStillPlaying = (user: string, whoAsked: string) => {
    sendJsonMessage({ message: "/stillPlaying " + user + " " + whoAsked });
  };

  const handleDisconnect = () => {
    sendJsonMessage({ message: "/disconnect" });
  };

  const handleSurrender = (game_id: string) => {
    const toSend = "/surrender " + game_id;
    sendJsonMessage({ message: toSend });
  };

  const handleReadyFour = (sender: string, receiver: string) => {
    const toSend = "/readyFour " + sender + " " + receiver;
    sendJsonMessage({ message: toSend });
  };

  const handleStartGameFour = (
    user: string,
    leftTop: string,
    leftBottom: string,
    rightTop: string,
    rightBottom: string
  ) => {
    const toSend =
      "/fourDebut " +
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
    handleStartGame,
    handleMovePaddle,
    handleChangeBallDirection,
    handleEnemyScore,
    handleMovePaddleFour,
    handleEndGame,
    handleChangeBallDirectionFour,
    handleEnemyScoreFour,
    handleReadyFour,
    handleTime,
    handleDisconnect,
    handleTimeFour,
    handleReadyToStartFour,
    handleWhoLeftGame,
    handleUserLeftGame,
    handleTimeResponse,
    handleStillPlaying,
    handleSurrenderFour,
    handleSurrender,
    handleStartGameFour,
  };
}
