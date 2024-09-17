"use client";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useGetFriends from "@/app/(chor)/chat/hooks/useGetFriends";
import { User } from "@/lib/types";

export default function FriendList({ user_id }: { user_id: string }) {
  const { data: friends, isSuccess } = useGetFriends(user_id );
  return (
    <Card className="p-4   flex  lg:w-72 flex-col">
      <p className="text-center w-full">Friends</p>
      <Separator />
      <div className="p-4">
        {isSuccess &&
          friends.map((friend: User, index: number) => (
            <TooltipProvider delayDuration={0} key={index}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger className="w-10 ml-1">
                  <Link href={`/profile/${friend.id}`}>
                    <Avatar className="rounded-sm">
                      <AvatarImage
                        src={friend.avatar}
                        alt="profile image"
                        className="rounded-sm"
                      />
                      <AvatarFallback className="rounded-sm">PF</AvatarFallback>
                      {friend.status === "online" && (
                        <div className="bg-green-500 size-2 rounded-full absolute bottom-[4px] right-1 z-50"></div>
                      )}
                    </Avatar>
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="flex items-center gap-4">
                  {friend.username}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
      </div>
    </Card>
  );
}
