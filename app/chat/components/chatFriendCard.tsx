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
          <AvatarFallback className="rounded-full">
            {friend.username?.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <p className="text-center flex items-center mr-2 w-full  overflow-clip ">
          {friend.username}
        </p>
      </div>
      <div className="flex justify-center items-center ">
        <User2
          onClick={handleViewProfile}
          className="text-green-600/70 mr-2 hover:scale-110"
        >
          Profile
        </User2>
        <div className="relative flex justify-center">
          {friend.has_unread_messages && (
            <div className="bg-primary size-2 rounded-full  absolute z-50 animate-pulse right-0" />
          )}
          <MessageCircle
            className=" hover:scale-110"
            onClick={() => setReceiverId(parseInt(friend.id))}
          ></MessageCircle>
        </div>
      </div>
    </div>
  );
}
