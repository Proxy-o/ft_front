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
    <div className="flex p-2  rounded-sm  bg-secondary/20 hover:bg-secondary my-1 w-full ">
      <div className="flex flex-1">
        <Avatar className="rounded-sm mr-2">
          <AvatarImage
            src={friend.avatar}
            alt="profile image"
            className="rounded-sm"
          />
          <AvatarFallback className="rounded-sm">PF</AvatarFallback>
        </Avatar>
        <p className="text-center flex items-center mr-2 w-fit overflow-clip ">
          {friend.username}
        </p>
      </div>
      <div className="flex justify-center items-center">
        <User2 onClick={handleViewProfile} className="text-green-600/70 mr-2">
          Profile
        </User2>
        <MessageCircle
          className="text-primary"
          onClick={() => setReceiverId(parseInt(friend.id))}
        >
          Chat
        </MessageCircle>
      </div>
    </div>
  );
}
