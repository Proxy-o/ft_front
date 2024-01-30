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
import { useQueryClient } from "@tanstack/react-query";

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
  };
  const { data, isSuccess, fetchNextPage } = useGetMessages({
    senderId,
    receiverId,
  });
  const queryClient = useQueryClient();
  console.log(data);
  useEffect(() => {
    if (lastMessage) {
      queryClient.invalidateQueries({
        queryKey: [`messages_${senderId}_${receiverId}`],
      });
    }
  }, [lastMessage, queryClient, senderId, receiverId]);
  return (
    <Card className="p-8 relative">
      {lastMessage && <p>Last message: {lastMessage.data}</p>}
      {isSuccess &&
        data?.pages
          .slice()
          .reverse()
          .map((page) => {
            return page.results
              .slice()
              .reverse()
              .map((result: any, index: number) => {
                return (
                  <ChatBubble
                    key={index}
                    message={result.content}
                    me={result.user == user_id}
                  />
                );
              });
          })}
      {"status " + connectionStatus}
      <Input onChange={(e) => setMessage(e.target.value)} />
      <Button onClick={() => fetchNextPage()}>Load More</Button>
      <Button onClick={handelSendMessage}>Send</Button>
    </Card>
  );
}
