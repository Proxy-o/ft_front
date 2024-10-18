import { LastMessage } from "@/app/(chor)/chat/types";
import useGetUser from "@/app/(chor)/profile/hooks/useGetUser";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

export default function useChatSocket() {
  const [socketUrl, setSocketUrl] = useState<string | null>(null);
  const { data: user } = useGetUser("0");

  useEffect(() => {

    if ( user?.s_token) {
      setSocketUrl(
        process.env.NEXT_PUBLIC_CHAT_URL +
          "2/?user_id=" +
          user?.id +
          "&s_token=" +
          user?.s_token
      );
    }
  }, [ user]);

  const {
    lastJsonMessage,
    lastMessage,
    readyState,
    sendJsonMessage,
  }: {
    lastJsonMessage: LastMessage;
    lastMessage: MessageEvent<any> | null;
    readyState: number;
    sendJsonMessage: (message: { message: string }) => void;
  } = useWebSocket(socketUrl, {
    share: true,
    shouldReconnect: () => !!socketUrl,
  });

  return { lastJsonMessage, readyState, sendJsonMessage, lastMessage };
}
