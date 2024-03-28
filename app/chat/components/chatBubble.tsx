import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/types";
import React from "react";

export default function ChatBubble({
  message,
  me,
  sender,
  receiver,
}: {
  message: string;
  me: boolean;
  sender: User;
  receiver: User;
}) {
  return me ? (
    <div className="flex flex-col w-full items-end h-fit">
      <p className="flex flex-col  max-w-[320px] p-4 rounded-2xl bg-primary/80 mb-2  h-fit break-words whitespace-normal mr-2">
        {message}
      </p>
    </div>
  ) : (
    //  message div to the right side
    <div className="flex w-full h-fit items-center">
      <Avatar className=" mr-2 size-4">
        <AvatarImage
          src={sender.avatar}
          alt="profile image"
          className="rounded-full size-1"
        />
        <AvatarFallback className="rounded-sm size-4 text-xs">
          RCV
        </AvatarFallback>
      </Avatar>
      <p className="flex flex-col  max-w-[320px] leading-1.5 p-3  rounded-2xl bg-secondary mb-2  h-fit  break-words whitespace-normal">
        {message}
      </p>
    </div>
  );
}
