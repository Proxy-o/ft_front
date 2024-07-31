import getCookie from "@/lib/functions/getCookie";
import useWebSocket from "react-use-websocket";

export default function useInvitationSocket() {
  const user_id = getCookie("user_id");
  const token = getCookie("refresh");
  const socketUrl =
    process.env.NEXT_PUBLIC_INVITATION_URL + "/?refresh=" + token;

  const { sendJsonMessage, lastMessage } = useWebSocket(socketUrl);

  const handelSendInvitation = (receiver: string) => {
    const toSend = "/notif " + user_id + " " + receiver;
    sendJsonMessage({ message: toSend });
  };

  const newNotif = () => {
    return lastMessage;
  };

  const handleAcceptInvitation = (invitationId: string) => {
    const toSend = "/accept " + invitationId;
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

  const handleSurrender = (
    surrenderer: string,
    winner: string,
    game_id: string
  ) => {
    const toSend = "/surrender " + surrenderer + " " + winner + " " + game_id;
    sendJsonMessage({ message: toSend });
  };

  const handleRefetchPlayers = (game_id: string) => {
    const toSend = "/refetchPlayers " + game_id;
    sendJsonMessage({ message: toSend });
  };

  const handleReadyFour = (sender: string, receiver: string) => {
    const toSend = "/readyFour " + sender + " " + receiver;
    sendJsonMessage({ message: toSend });
  };

  const handleReadyToStartFour = (
    user1: string,
    user2: string,
    user3: string,
    user4: string
  ) => {
    const toSend =
      "/readyToStartFour " + user1 + " " + user2 + " " + user3 + " " + user4;
    sendJsonMessage({ message: toSend });
  };

  const handleAcceptTournamentInvitation = (invitationId: string) => {
    const toSend = "/acceptTournament " + invitationId;
    sendJsonMessage({ message: toSend });
  };

  const handleRefetchTournament = (tournamentId: string) => {
    sendJsonMessage({ message: "/refetchTournament " + tournamentId });
  };

  const handleInvitationDecline = (invitationId: string) => {
    sendJsonMessage({ message: "/decline " + invitationId });
  };

  return {
    handelSendInvitation,
    newNotif,
    handleAcceptInvitation,
    handleSurrender,
    handleStartGameFour,
    handleRefetchPlayers,
    handleReadyFour,
    handleReadyToStartFour,
    handleRefetchTournament,
    handleAcceptTournamentInvitation,
    handleInvitationDecline,
  };
}
