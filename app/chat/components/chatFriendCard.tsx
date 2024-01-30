import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/types";
import React from "react";

export default function ChatFriendCard({ friend }: { friend: User }) {
  return (
    <div>
      <Avatar className="rounded-sm">
        <AvatarImage
          src={friend.avatar}
          alt="profile image"
          className="rounded-sm"
        />
        <AvatarFallback className="rounded-sm">PF</AvatarFallback>
      </Avatar>
      <p className="text-center">{friend.username}</p>
    </div>
  );
}
