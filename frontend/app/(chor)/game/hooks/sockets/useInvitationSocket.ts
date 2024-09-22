import getCookie from "@/lib/functions/getCookie";
import useWebSocket from "react-use-websocket";

export default function useInvitationSocket() {
  const user_id = getCookie("user_id");
  const token = getCookie("refresh");
  const socketUrl =
    process.env.NEXT_PUBLIC_INVITATION_URL + "/?refresh=" + token;

  const { sendJsonMessage, lastMessage, lastJsonMessage } = useWebSocket(socketUrl);

  const handelSendInvitation = (receiver: string, gameType: string) => {
    const toSend = "/notif " + user_id + " " + receiver + " " + gameType;
    sendJsonMessage({ message: toSend });
  };

  const newNotif = () => {
    return lastMessage;
  };

  const handleAcceptInvitation = (invitationId: string) => {
    const toSend = "/accept " + invitationId;
    sendJsonMessage({ message: toSend });
  };

  const handleRefetchPlayers = (game_id: string) => {
    const toSend = "/refetchPlayers " + game_id;
    sendJsonMessage({ message: toSend });
  };

  const handleAcceptTournamentInvitation = (invitationId: string) => {
    const toSend = "/acceptTournament " + invitationId;
    // console.log(toSend);
    sendJsonMessage({ message: toSend });
  };

  const handleStartTournament = (tournamentId: string) => {
    sendJsonMessage({ message: "/startTournament " + tournamentId });
  }

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
    handleStartTournament,
    handleRefetchPlayers,
    handleRefetchTournament,
    handleAcceptTournamentInvitation,
    handleInvitationDecline,
    lastJsonMessage
  };
}
