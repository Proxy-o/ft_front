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
import { cn } from "@/lib/utils";

export default function FriendList({ user_id }: { user_id: string }) {
  const { data: friends, isSuccess } = useGetFriends(user_id);
  return (
    <Card className=" p-4  max-h-96 flex  lg:w-72 flex-col items-center overflow-y-auto scrollbar scrollbar-thumb-primary/20 scrollbar-w-2">
      <p className="text-center w-full">Friends</p>
      <Separator />
      <div className=" pl-4 mt-2 ">
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

                      <div
                        className={cn(
                          " size-2 rounded-full absolute bottom-[0px] right-0 z-49 border border-white",
                          friend.status === "online"
                            ? "bg-green-500"
                            : friend.status === "playing"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        )}
                      />
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
