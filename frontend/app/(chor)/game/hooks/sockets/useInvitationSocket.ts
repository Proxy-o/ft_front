import useGetUser from "@/app/(chor)/profile/hooks/useGetUser";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

export default function useInvitationSocket() {
  const [socketUrl, setSocketUrl] = useState<string | null>(null);
  const { data: user, isLoading } = useGetUser("0");

  useEffect(() => {
    if (!isLoading && user?.s_token) {
      // console.log("user?.s_token", user?.s_token);
      setSocketUrl(
        process.env.NEXT_PUBLIC_INVITATION_URL +
          "/?user_id=" +
          user?.id +
          "&s_token=" +
          user?.s_token
      );
    }
  }, [isLoading, user]);
  const { sendJsonMessage, lastMessage, lastJsonMessage } = useWebSocket(
    socketUrl,
    {
      share: true,
      shouldReconnect: () => !!socketUrl,
    }
  );

  const handelSendInvitation = (receiver: string, gameType: string) => {
    const toSend = "/notif " + user?.id + " " + receiver + " " + gameType;
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
    handleRefetchPlayers,
    handleInvitationDecline,
    lastJsonMessage,
  };
}
