import { LastMessage } from "@/app/(chor)/chat/types";
import useGetUser from "@/app/(chor)/profile/hooks/useGetUser";
import getCookie from "@/lib/functions/getCookie";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";

export default function useChatSocket() {
  const [socketUrl, setSocketUrl] = useState<string | null>(null);
  const { data: user, isLoading } = useGetUser("0");
  const token = getCookie("refresh");

  useEffect(() => {
    if (!isLoading && user?.id) {
      setSocketUrl(
        process.env.NEXT_PUBLIC_CHAT_URL +
          "2/?refresh=" +
          token +
          "&user_id=" +
          user?.id
      );
    }
  }, [isLoading, user, token]);

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
