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
import { Activity, Check, Clock, SquarePen, Users } from "lucide-react";
import React, { useContext, useState } from "react";
import EditProfile from "./editProfile";
import getCookie from "@/lib/functions/getCookie";
import ProfileAvatar from "./profileAvatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import useEditUser from "../hooks/useEditUser";
import useAddFriend from "../hooks/useAddFriend";

export default function UserInfo({
  currentUser,
  canEdit,
  userId,
}: {
  currentUser: User;
  canEdit: boolean;
  userId: string;
}) {
  const [visible, setVisible] = useState(true);
  const [status, setStatus] = useState(currentUser.status);
  const { mutate: editUser } = useEditUser();
  const { mutate: addFriend } = useAddFriend();
  const id = currentUser.id;

  const handleSubmit = () => {
    if (status !== currentUser.status) {
      editUser({ id, status });
    }
    setVisible(!visible);
  };
  return (
    <Card className="relative rounded-lg shadow-md p-6 md:flex max-w-7xl">
      {canEdit && <EditProfile />}
      <div className=" sm:w-40 sm:h-40">
        <ProfileAvatar currentUser={currentUser} canEdit={canEdit} />
      </div>
      <div className=" flex-1 px-6">
        <div className="text-2xl font-bold mt-4 sm:mt-0">
          {currentUser.username}
        </div>
        {canEdit && (
          <div className="flex text-zinc-300 mt-4 items-center">
            <p className={cn(!visible && "hidden")}>
              {status || "Enter status"}
            </p>
            <Input
              className={cn(visible && "hidden relative")}
              onChange={(e) => setStatus(e.target.value)}
              defaultValue={status}
            />
            <Check
              className={cn(
                visible && "hidden",
                "hover:cursor-pointer hover:bg-primary m-2 bg-secondary p-1 absolute right-12 rounded-sm"
              )}
              size={30}
              onClick={handleSubmit}
            />
            <SquarePen
              onClick={() => setVisible(!visible)}
              className={cn(
                !visible && "hidden",
                "ml-2 hover:cursor-pointer hover:text-zinc-300 hover:bg-secondary p-1 rounded-sm"
              )}
              size={30}
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
          {canEdit ? (
            <Button className="mt-6 w-full" variant="outline">
              Logout
            </Button>
          ) : (
            <>
              <Button className="mt-6 w-full" variant="outline">
                Message
              </Button>
              <Button className="mt-6 w-full" variant="outline">
                Challenge
              </Button>
              <Button
                className="mt-6 w-full"
                variant="outline"
                onClick={() => addFriend(userId)}
              >
                Add Friend
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
