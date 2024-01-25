"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { User } from "@/lib/types";
import { Activity, Clock, SquarePen, Users } from "lucide-react";
import React, { useContext } from "react";
import EditProfile from "./editProfile";
import getCookie from "@/lib/functions/getCookie";

export default function UserInfo({ currentUser }: { currentUser: User }) {
  const id = currentUser.id;
  const id_cookie = getCookie("user_id");
  const isLogged_in =
    getCookie("logged_in") === "yes" && id === parseInt(id_cookie || "0");
  return (
    <Card className="relative rounded-lg shadow-md p-6 md:flex max-w-7xl">
      {isLogged_in && <EditProfile />}
      <div className=" sm:w-40 sm:h-40">
        <Avatar className="rounded-sm w-full h-full">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback className="rounded-sm">AV</AvatarFallback>
        </Avatar>
      </div>
      <div className=" flex-1 px-6">
        <div className="text-2xl font-bold mt-4 sm:mt-0">
          {currentUser.username}
        </div>
        {isLogged_in && (
          <div className="flex text-zinc-300 mt-4 items-center">
            Enter status here
            <SquarePen
              className="ml-2 hover:cursor-pointer hover:text-zinc-300"
              size={18}
            />
          </div>
        )}
        <div className="flex justify-around items-center w-full mt-6">
          <TooltipProvider delayDuration={0}>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="flex flex-col justify-center items-center text-zinc-300/50 hover:text-zinc-300/70">
                  <Activity className="mb-2" />
                  <p className="text-sm sm:text-m">Online</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Online</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col justify-center items-center text-zinc-300/50 hover:text-zinc-300/70 ">
                  <Users className="mb-2" />
                  <p className="text-sm sm:text-m">23</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Friends</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col justify-center items-center text-zinc-300/50 hover:text-zinc-300/70">
                  <Clock className="mb-2" />
                  <p className="text-sm sm:text-m">Nov 29, 2020</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Nov 29, 2020</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex justify-center items-center space-x-3 ">
          {isLogged_in && (
            <>
              <Button className="mt-6 w-full" variant="outline">
                Message
              </Button>
              <Button className="mt-6 w-full" variant="outline">
                Challenge
              </Button>
              <Button className="mt-6 w-full" variant="outline">
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
