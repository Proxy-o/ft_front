import getCookie from "@/lib/functions/getCookie";
import useWebSocket from "react-use-websocket";

export default function useGameSocket() {
  const user_id = getCookie("user_id");
  const token = getCookie("refresh");
  const socketUrl = process.env.NEXT_PUBLIC_INVIATION_URL + "/?refresh=" + token;

    const { sendJsonMessage, lastMessage } = useWebSocket(socketUrl);

    const handelSendInvitation = (receiver: string) => {
      const toSend = "/notif " + user_id + " " + receiver;
      sendJsonMessage({ message: toSend });
    };

    const newNotif = () => {
      return lastMessage;
    }

    const handleAcceptInvitation = (invitationId: string) => {
      const toSend = "/accept " + invitationId;
      sendJsonMessage({ message: toSend });
    }

    const handleStartGame = (user1: string, user2: string) => {
      const toSend = "/debut " + user1 + " " + user2
      sendJsonMessage({ message: toSend });
    }

    const handleSurrender = (surrenderer: string, winner: string, game_id: string) => {
      const toSend = "/surrender " + surrenderer + " " + winner + " " + game_id;
      console.log(toSend);
      sendJsonMessage({ message: toSend });
    }

    const handleMovePaddle = (paddleY: number, user: string) => {
      const toSend = "/move " + paddleY + " " + user;
      sendJsonMessage({ message: toSend });
    }

 const handleChangeBallDirection = (ballX: number, ballY: number, angle: number, user: string) => {
    const toSend = "/changeBallDirection " + ballX + " " + ballY + " " + angle + " " + user;
    sendJsonMessage({ message: toSend });
 };

 const handleEnemyScore = (newScore: number, user: string) => {
    const toSend = "/enemyScore " + newScore + " " + user;
    sendJsonMessage({ message: toSend });
    // TODO: catch this in backend
 }


 return {
    handelSendInvitation,
    newNotif,
    handleAcceptInvitation,
    handleStartGame,
    handleSurrender,
    handleMovePaddle,
    handleChangeBallDirection,
    handleEnemyScore,
 };
}
