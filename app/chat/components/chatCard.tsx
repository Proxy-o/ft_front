"use client";
import { Button } from "@/components/ui/button";
import getCookie from "@/lib/functions/getCookie";
import React, { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Card } from "@/components/ui/card";
import useGetMessages from "../hooks/useGetMessages";
import ChatBubble from "./chatBubble";
import { Conversation } from "../types";
import { Input } from "@/components/ui/input";

export default function ChatCard({ senderId, receiverId }: Conversation) {
  const token = getCookie("refresh");
  const user_id = getCookie("user_id");
  const [socketUrl, setSocketUrl] = useState(
    process.env.NEXT_PUBLIC_CHAT_URL + "2/?refresh=" + token
  );
  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const [message, setMessage] = useState("");
  const handelSendMessage = () => {
    const toSend = "/pm " + receiverId + " " + message;
    sendJsonMessage({ message: toSend });
    console.log("send");
  };
  const { data, isSuccess } = useGetMessages({ senderId, receiverId });
  console.log(data);
  return (
    <Card className="p-8 relative">
      {lastMessage && <p>Last message: {lastMessage.data}</p>}
      {isSuccess &&
        data.map(
          (
            message: { content: string; receiver: string; user: string },
            index: number
          ) => (
            console.log(message.user == user_id),
            (
              <ChatBubble
                message={message.content}
                me={message.user == user_id}
                key={index}
              />
            )
          )
        )}
      {"status " + connectionStatus}
      <Input onChange={(e) => setMessage(e.target.value)} />
      <Button onClick={handelSendMessage}>Send</Button>
    </Card>
  );
}
