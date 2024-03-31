"use client";
import ChatList from "./components/chatList";
import readMessages from "./hooks/useReadMessages";
import getCookie from "@/lib/functions/getCookie";
import useWebSocket from "react-use-websocket";
import { useEffect } from "react";

export default function Page() {
  // send a post to unread_messages to mark all messages as read
  const token = getCookie("refresh");
  const socketUrl = process.env.NEXT_PUBLIC_CHAT_URL + "2/?refresh=" + token;
  const { lastMessage } = useWebSocket(socketUrl);

  useEffect(() => {
    readMessages();
  }, [lastMessage]);
  return <ChatList />;
}
