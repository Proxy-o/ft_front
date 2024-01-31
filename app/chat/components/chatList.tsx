import { Card } from "@/components/ui/card";
import React, { useContext, useState } from "react";
import useGetUsers from "../hooks/useGetUsers";
import { User } from "@/lib/types";
import ChatFriendCard from "./chatFriendCard";
import ChatCard from "./chatCard";
import { UserContext } from "@/lib/providers/UserContext";
import getCookie from "@/lib/functions/getCookie";
import useGetFriends from "../hooks/useGetFriends";

export default function ChatList() {
  const user_id = getCookie("user_id");
  const { data, isSuccess } = useGetFriends(user_id || "0");
  const [receiverId, setReceiverId] = React.useState<number>(0);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const handleChatOpen = (friend: User) => {
    if (!isChatOpen) {
      setIsChatOpen(true);
    }
    setReceiverId(parseInt(friend.id));
  };
  return (
    <div className="relative">
      <Card>
        {isSuccess &&
          data.map((friend: User) => {
            return (
              <div
                key={friend.id}
                onClick={() => handleChatOpen(friend)}
                className="cursor-pointer"
              >
                <ChatFriendCard friend={friend} />
              </div>
            );
          })}
      </Card>
      <div
        className="absolute right-0 min-w-[25rem] max-h-96 "
        hidden={!isChatOpen}
      >
        <ChatCard senderId={parseInt(user_id!)} receiverId={receiverId} />
      </div>
    </div>
  );
}
