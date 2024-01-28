"use client";
import { Button } from "@/components/ui/button";
import getCookie from "@/lib/functions/getCookie";
import React, { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import useGetMessages from "./hooks/useGetMessages";
import { Card } from "@/components/ui/card";
import ChatBubble from "./components/chatBubble";

export default function Page() {
  const token = getCookie("refresh");
  const [socketUrl, setSocketUrl] = useState(
    process.env.NEXT_PUBLIC_CHAT_URL + "ka/?refresh=" + token
  );
  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const handelSendMessage = () => {
    sendJsonMessage({ message: "Hello" });
  };
  const { data } = useGetMessages({ senderId: "2", receiverId: "1" });
  console.log(data);
  return (
    <Card className="p-8">
      {data.map(
        (message: { content: string; receiver: string }, index: number) => (
          <ChatBubble message={message.content} key={index} />
        )
      )}
    </Card>
  );
}
