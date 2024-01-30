import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { Friend } from "../types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Friends() {
  const friends: Friend[] = [
    {
      username: "hmza zbi",
      avatar:
        "https://images.chesscomfiles.com/uploads/v1/user/100386670.bbb41909.50x50o.d37d58323b79@2x.jpg",
      id: "1",
    },
    {
      username: "hmza zbi",
      avatar:
        "https://images.chesscomfiles.com/uploads/v1/user/240333993.765c3b4d.50x50o.ee7d8f95026d@2x.jpg",
      id: "1",
    },
    {
      username: "hmza zbi",
      avatar:
        "https://images.chesscomfiles.com/uploads/v1/user/100386670.bbb41909.50x50o.d37d58323b79@2x.jpg",
      id: "1",
    },
    {
      username: "hmza zbi",
      avatar:
        "https://images.chesscomfiles.com/uploads/v1/user/240333993.765c3b4d.50x50o.ee7d8f95026d@2x.jpg",
      id: "1",
    },
    {
      username: "hmza zbi",
      avatar:
        "https://images.chesscomfiles.com/uploads/v1/user/240333993.765c3b4d.50x50o.ee7d8f95026d@2x.jpg",
      id: "1",
    },
    {
      username: "hmza zbi",
      avatar:
        "https://images.chesscomfiles.com/uploads/v1/user/240333993.765c3b4d.50x50o.ee7d8f95026d@2x.jpg",
      id: "1",
    },
    {
      username: "hmza zbi",
      avatar:
        "https://images.chesscomfiles.com/uploads/v1/user/240333993.765c3b4d.50x50o.ee7d8f95026d@2x.jpg",
      id: "1",
    },
    {
      username: "hmza zbi",
      avatar:
        "https://images.chesscomfiles.com/uploads/v1/user/240333993.765c3b4d.50x50o.ee7d8f95026d@2x.jpg",
      id: "1",
    },
    {
      username: "hmza zbi",
      avatar:
        "https://images.chesscomfiles.com/uploads/v1/user/100386670.bbb41909.50x50o.d37d58323b79@2x.jpg",
      id: "1",
    },
    {
      username: "hmza zbi",
      avatar:
        "https://images.chesscomfiles.com/uploads/v1/user/100386670.bbb41909.50x50o.d37d58323b79@2x.jpg",
      id: "1",
    },
    {
      username: "hmza zbi",
      avatar:
        "https://images.chesscomfiles.com/uploads/v1/user/100386670.bbb41909.50x50o.d37d58323b79@2x.jpg",
      id: "1",
    },
    {
      username: "hmza zbi",
      avatar:
        "https://images.chesscomfiles.com/uploads/v1/user/240333993.765c3b4d.50x50o.ee7d8f95026d@2x.jpg",
      id: "1",
    },
    {
      username: "hmza zbi",
      avatar:
        "https://images.chesscomfiles.com/uploads/v1/user/240333993.765c3b4d.50x50o.ee7d8f95026d@2x.jpg",
      id: "1",
    },
    {
      username: "hmza zbi",
      avatar:
        "https://images.chesscomfiles.com/uploads/v1/user/100386670.bbb41909.50x50o.d37d58323b79@2x.jpg",
      id: "1",
    },
  ];
  return (
    <Card className="p-4   flex  lg:w-72 flex-col">
      <p className="text-center w-full">Friends</p>
      <Separator />
      <div className="p-4">
        {friends.map((friend, index) => (
          <TooltipProvider delayDuration={0} key={index}>
            <Tooltip delayDuration={0}>
              <TooltipTrigger className="w-10 ml-1">
                <Link href="#">
                  <Avatar className="rounded-sm">
                    <AvatarImage
                      src={friend.avatar}
                      alt="profile image"
                      className="rounded-sm"
                    />
                    <AvatarFallback className="rounded-sm">PF</AvatarFallback>
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
