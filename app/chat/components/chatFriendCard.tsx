import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/types";
import { MessageCircle, User2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function ChatFriendCard({
  friend,
  setReceiverId,
}: {
  friend: User;
  setReceiverId: React.Dispatch<React.SetStateAction<number>>;
}) {
  const router = useRouter();

  const handleViewProfile = () => {
    router.push(`/profile/${friend.id}`);
  };
  return (
    <div className="flex p-2  rounded-sm  bg-secondary/60 hover:bg-secondary my-1 w-full ">
      <div className="flex flex-1 ">
        <Avatar className="rounded-full mr-2 relative">
          {friend.status === "offline" && (
            <div className="bg-green-500 size-2 rounded-full absolute bottom-[5px] right-1 z-50"></div>
          )}
          <AvatarImage
            src={friend.avatar}
            alt="profile image"
            className="rounded-full  hover:scale-110"
          />
          <AvatarFallback className="rounded-full">PF</AvatarFallback>
        </Avatar>
        <p className="text-center flex items-center mr-2 w-fit overflow-clip ">
          {friend.username}
        </p>
      </div>
      <div className="flex justify-center items-center ">
        {friend.has_unread_messages && (
          <div className="bg-primary size-2 rounded-full  bottom-[5px] right-1 z-50" />
        )}
        <User2
          onClick={handleViewProfile}
          className="text-green-600/70 mr-2 hover:scale-110"
        >
          Profile
        </User2>
        <MessageCircle
          className="text-primary hover:scale-110"
          onClick={() => setReceiverId(parseInt(friend.id))}
        >
          Chat
        </MessageCircle>
      </div>
    </div>
  );
}
