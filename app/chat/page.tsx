"use client";
import ChatList from "./components/chatList";
import useReadMessages from "./hooks/useReadMessages";

export default function Page() {
  // send a post to unread_messages to mark all messages as read
  const response = useReadMessages();
  return <ChatList />;
}
