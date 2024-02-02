import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/types";
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
        <p className="text-center flex items-center mr-2 w-5 overflow-clip ">
          {friend.username}
        </p>
      </div>
      <Button
        className=" hover:bg-blue-500/10 mr-2"
        variant={"outline"}
        onClick={() => setReceiverId(parseInt(friend.id))}
      >
        Chat
      </Button>
      <Button
        onClick={handleViewProfile}
        className=" hover:bg-green-500/10"
        variant={"outline"}
      >
        Profile
      </Button>
    </div>
  );
}
