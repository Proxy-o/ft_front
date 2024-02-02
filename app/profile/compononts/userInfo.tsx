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
import {
  Activity,
  BanIcon,
  BlocksIcon,
  Check,
  Clock,
  SquarePen,
  Users,
} from "lucide-react";
import React, { useContext, useState } from "react";
import EditProfile from "./editProfile";
import getCookie from "@/lib/functions/getCookie";
import ProfileAvatar from "./profileAvatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import useEditUser from "../hooks/useEditUser";
import useAddFriend from "../../friends/hooks/useAddFriend";
import useUnfriend from "@/app/friends/hooks/useUnfriend";
import useGetFriends from "@/app/chat/hooks/useGetFriends";
import useGetFrdReq from "@/app/friends/hooks/useGetFrReq";
import useBlock from "@/app/friends/hooks/useBlockUser";
import useGetBlocked from "@/app/friends/hooks/useGetBlocked";
import useUnBlock from "@/app/friends/hooks/useUnBlockUser";
import useAcceptFriend from "@/app/friends/hooks/useAcceptFriend";
import ChatCard from "@/app/chat/components/chatCard";

export default function UserInfo({
  user,
  canEdit,
  current_user_id,
  isBlocked,
  blocked_by_current_user,
  setChatOpen,
}: {
  user: User;
  canEdit: boolean;
  current_user_id: string;
  isBlocked: boolean;
  blocked_by_current_user: boolean;
  setChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [visible, setVisible] = useState(true);
  const [status, setStatus] = useState(user.status);
  const { mutate: editUser } = useEditUser();
  const { mutate: addFriend } = useAddFriend();
  const { mutate: unfriend } = useUnfriend();
  const { mutate: block } = useBlock();
  const { mutate: unBlock } = useUnBlock();
  const { data: friendReq } = useGetFrdReq();
  const { mutate: acceptFriend } = useAcceptFriend();
  const { data: friends, isSuccess } = useGetFriends(current_user_id);
  const id = user.id;
  const isFriend =
    isSuccess && friends.some((friend: User) => friend.id === id);

  const isReqSent = friendReq?.some((req: any) => req.to_user.id === id);
  const recReqId = friendReq?.find(
    (req: any) => req.to_user.id == current_user_id
  )?.id;

  console.log(friendReq);
  const handleSubmit = () => {
    if (status !== user.status) {
      editUser({ id, status });
    }
    setVisible(!visible);
  };
  return (
    <Card className="relative rounded-lg shadow-md p-6 md:flex max-w-7xl">
      <div className="absolute top-0 right-0 p-2">
        {isBlocked && blocked_by_current_user ? (
          <Button
            className="bg-green-800/25"
            variant={"outline"}
            onClick={() => unBlock(id)}
          >
            Unblock
          </Button>
        ) : (
          !isBlocked &&
          current_user_id != id && (
            <Button
              className="bg-red-800/25"
              variant={"outline"}
              onClick={() =>
                block({ to_block: user, user_id: current_user_id })
              }
            >
              Block
            </Button>
          )
        )}
      </div>
      {canEdit && <EditProfile user={user} />}
      <div className=" sm:w-40 sm:h-40">
        <ProfileAvatar user={user} canEdit={canEdit} isBlocked={isBlocked} />
      </div>
      <div className=" flex-1 px-6">
        <div className="text-2xl font-bold mt-4 sm:mt-0">{user.username}</div>
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
              {!isFriend && !isBlocked && !recReqId ? (
                <Button
                  className="mt-6 w-full"
                  variant="outline"
                  onClick={() => addFriend(id)}
                  disabled={isReqSent || isBlocked}
                >
                  Add Friend
                </Button>
              ) : (
                recReqId && (
                  <Button
                    className="mt-6 w-full bg-green-400/20"
                    variant="outline"
                    onClick={() =>
                      acceptFriend({
                        user_id: current_user_id,
                        friend: user,
                        to_accept_id: recReqId,
                      })
                    }
                  >
                    Accept Request
                  </Button>
                )
              )}
              {isFriend && (
                <>
                  <Button
                    className="mt-6 w-full"
                    variant="outline"
                    onClick={() => setChatOpen((val) => !val)}
                  >
                    Message
                  </Button>
                  <Button className="mt-6 w-full" variant="outline">
                    Challenge
                  </Button>
                  <Button
                    className="mt-6 w-full"
                    variant="outline"
                    onClick={() =>
                      unfriend({ to_unfriend: user, user_id: current_user_id })
                    }
                  >
                    unfriend
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
