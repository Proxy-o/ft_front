"use client";

import { RefreshCcw, Sword, UserRoundSearch } from "lucide-react";
import useGetFriends from "@/app/(chor)/chat/hooks/useGetFriends";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useSendInvitation from "../../hooks/invitations/useSendInvitation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import useGetUser from "../../../profile/hooks/useGetUser";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

const InviteFriends = ({ gameType }: { gameType: string }) => {
  const { data: user } = useGetUser("0");

  const friends = useGetFriends(user?.id);

  const data: [
    { id: string; username: string; avatar: string; status: string }
  ] = friends.data || [];

  const onlineFriends = data.filter(
    (friend: { status: string }) =>
      friend.status === "online" || friend.status === "playing"
  );

  const [refreshing, setRefreshing] = useState(false);
  const refreshFriends = () => {
    setRefreshing(true);
    friends.refetch();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);

  }

  const { mutate: invite } = useSendInvitation();

  const router = useRouter();

  return (
    <Card className={`w-full md:aspect-[2] flex flex-col max-h-60 p-2 ${refreshing && "animate-pulse cursor-progress"}`}>
      <div className="w-full h-fit text-center text-lg flex flex-row font-bold pb-2">
        <div className="flex flex-row justify-center items-center w-full">
          Invite
        </div>
        <TooltipProvider delayDuration={0}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button size={"xs"} onClick={() => {refreshFriends();}}>
                
                <RefreshCcw size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex flex-col w-full h-full items-center justify-start pt-2 border-t gap-2 overflow-auto">
        {onlineFriends.length ? (
          onlineFriends.map(
            (friend: {
              id: string;
              username: string;
              avatar: string;
              status: string;
            }) => {
              return (
                <div
                  key={friend.id}
                  className="flex flex-row justify-between w-10/12 items-start"
                >
                  <div
                    className="flex flex-row items-center justify-center cursor-pointer h-full gap-4"
                    onClick={() => {
                      router.push(`/profile/${friend.id}`);
                    }}
                  >
                    <Avatar className="relative">
                      <AvatarImage
                        src={friend.avatar}
                        alt="profile image"
                        className="rounded-md"
                      />
                      <AvatarFallback className="rounded-sm">PF</AvatarFallback>
                      <div
                        className={`absolute bottom-1 right-1 w-2 h-2 rounded-full border border-white 
                        ${friend.status === "online" && "bg-green-500"}
                        ${friend.status === "playing" && "bg-yellow-500"}
                        `}
                      ></div>
                    </Avatar>
                    <div className="w-full h-full flex justify-center items-center">
                      {friend.username}
                    </div>
                  </div>
                  <Button
                    size={"xs"}
                    onClick={() => {
                      friends.refetch();
                      invite({
                        userid: friend.id,
                        gameType: gameType,
                      });
                    }}
                  >
                    <Sword size={20} />
                  </Button>
                </div>
              );
            }
          )
        ) : (
          <div className="flex flex-row justify-center items-center gap-2 text-primary p-2 w-full">
            <UserRoundSearch />
            {data.length ? (
              <div>No friends online Go touch some grass</div>
            ) : (
              <div>You have no friends</div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default InviteFriends;
