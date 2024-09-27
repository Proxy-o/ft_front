import useGetUser from "@/app/(chor)/profile/hooks/useGetUser";
import getCookie from "@/lib/functions/getCookie";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

export default function useInvitationSocket() {
  const user_id = getCookie("user_id");
  const token = getCookie("refresh");
  const [socketUrl, setSocketUrl] = useState<string | null>(null);
  const { data: user, isLoading } = useGetUser("0");

  useEffect(() => {
    if (!isLoading && user?.s_token) {
      // console.log("user?.s_token", user?.s_token);
      setSocketUrl(
        process.env.NEXT_PUBLIC_INVITATION_URL +
          "/?refresh=" +
          token +
          "&s_token=" +
          user?.s_token
      );
    }
  }, [isLoading, user, token]);
  const { sendJsonMessage, lastMessage, lastJsonMessage } = useWebSocket(
    socketUrl,
    {
      share: true,
      shouldReconnect: () => !!socketUrl,
    }
  );

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
  };

  const handleRefetchTournament = (tournamentId: string) => {
    sendJsonMessage({ message: "/refetchTournament " + tournamentId });
  };

  const handleInvitationDecline = (invitationId: string) => {
    sendJsonMessage({ message: "/decline " + invitationId });
  };

  const handleLeaveGame = (leftUser: string, rightUser: string) => {
    const toSend = "/leaveGame " + leftUser + " " + rightUser;
    sendJsonMessage({ message: toSend });
  }

  return {
    handelSendInvitation,
    newNotif,
    handleAcceptInvitation,
    handleLeaveGame,
    handleStartTournament,
    handleRefetchPlayers,
    handleRefetchTournament,
    handleAcceptTournamentInvitation,
    handleInvitationDecline,
    lastJsonMessage,
  };
}
