"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/types";
import React, { useState } from "react";
import { Message } from "../types";

export default function ChatBubble({
  message,
  me,
  sender,
}: {
  message: Message;
  me: boolean;
  sender: User;
}) {
  const [showDate, setShowDate] = useState(false);
  return me ? (
    <div className="flex  w-full justify-end  h-fit hover:cursor-pointer items-center">
      <p className="border-2 mr-2 p-1 rounded-lg h-fit" hidden={!showDate}>
        <span className="text-xs text-gray-600 ">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </p>
      <p
        className="flex flex-col  max-w-[320px] p-3 rounded-2xl bg-primary mb-2  h-fit break-words whitespace-normal mr-2 text-white"
        onMouseEnter={() => setShowDate(true)}
        onMouseLeave={() => setShowDate(false)}
      >
        {message.content}
      </p>
    </div>
  ) : (
    <div className="flex w-full h-fit items-center relative hover:cursor-pointer">
      <Avatar className=" mr-2 size-4">
        <AvatarImage
          src={sender.avatar}
          alt="profile image"
          className="rounded-full size-4"
        />
        <AvatarFallback className="rounded-sm size-4 text-xs">R</AvatarFallback>
      </Avatar>
      <p
        className="flex flex-col  max-w-[320px] leading-1.5 p-3  rounded-2xl bg-secondary mb-2  h-fit  break-words whitespace-normal"
        onMouseEnter={() => setShowDate(true)}
        onMouseLeave={() => setShowDate(false)}
      >
        {message.content}
      </p>
      <p className="border-2 ml-2 p-1 rounded-lg" hidden={!showDate}>
        <span className="text-xs text-gray-600 ">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </p>
    </div>
  );
}
