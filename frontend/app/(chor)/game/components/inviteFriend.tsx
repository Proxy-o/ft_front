"use client";

import { Sword, UserRoundSearch } from "lucide-react";
import getCookie from "@/lib/functions/getCookie";
import useGetFriends from "@/app/(chor)/chat/hooks/useGetFriends";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useSendInvitation from "../hooks/useSendInvitation";
import { Card } from "@/components/ui/card";

const InviteFriends = ({ gameType }: { gameType: string }) => {
  const user_id = getCookie("user_id");

  const friends = useGetFriends(user_id || "0");

  const data: [{ id: string; username: string; avatar: string; status:string }] = friends.data || [];

  const onlineUsers = data.filter((user) => user.status === "online");

  const { mutate: invite } = useSendInvitation();

  return (
    <Card className="w-full h-full p-4 bg-background">
      <div className="w-full h-full flex flex-col justify-start items-start">
        <h1 className="text-4xl mx-auto border-b-2 pl-4 pb-4 w-full text-start">
          Defy a friend
        </h1>
        <div className="flex flex-col w-full items-center justify-between pt-4">
          {onlineUsers.length ? (
            onlineUsers.map(
              (friend: { id: string; username: string; avatar: string }) => {
                
                return (
                  <div
                    key={friend.id}
                    className="flex flex-row justify-between w-3/4 mx-5 items-center"
                  >
                    <div className="flex flex-row items-center">
                      <Avatar className=" mr-2 relative">
                        <AvatarImage
                          src={friend.avatar}
                          alt="profile image"
                          className="rounded-md h-8 w-8 bg-primary"
                        />
                        <AvatarFallback className="rounded-sm">
                          PF
                        </AvatarFallback>
                        <div className="absolute bottom-2 right-0 w-2 h-2 rounded-full"></div>
                      </Avatar>
                      <h1 className="ml-2">{friend.username}</h1>
                    </div>
                    <button
                      className="ml-2 bg-primary text-white px-2 py-1 rounded-md"
                      onClick={() => {
                        invite({
                          userid: friend.id,
                          gameType: gameType,
                        });
                      }}
                    >
                      <Sword size={20} />
                    </button>
                  </div>
                );
              }
            )
          ) : (
            <h1 className="flex gap-2 text-md mt-2 text-primary/70">
            <UserRoundSearch />
            You have no friends
          </h1>
          )}
        </div>
      </div>
    </Card>
  );
};

export default InviteFriends;
