"use client";

import { Sword, UserRoundSearch } from "lucide-react";
import useGetFriends from "@/app/(chor)/chat/hooks/useGetFriends";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useSendInvitation from "../hooks/useSendInvitation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import useGetUser from "../../profile/hooks/useGetUser";

const InviteFriends = ({ gameType }: { gameType: string }) => {
  const { data: user } = useGetUser("0");

  const friends = useGetFriends(user?.id);

  const data: [
    { id: string; username: string; avatar: string; status: string }
  ] = friends.data || [];

  const { mutate: invite } = useSendInvitation();

  const router = useRouter();

  return (
    <Card className="w-full md:aspect-[2] flex flex-col min-h-44 max-h-60 bg-background p-2">
      <div className="w-full h-fit text-center text-lg font-bold pb-2">
        Invite
      </div>
      <div className="flex flex-col w-full h-full items-center justify-start pt-2 border-t gap-2 overflow-auto">
        {data.length ? (
          data.map(
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
                      <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-green-400 border border-white"></div>
                    </Avatar>
                    <div className="w-full h-full flex justify-center items-center">
                      {friend.username}
                    </div>
                  </div>
                  <Button
                    // disabled={friend.status !== "online"} // todo: enable this when game is ready and fix it
                    size={"xs"}
                    onClick={() => {
                      invite({
                        userid: friend.id,
                        gameType: gameType,
                        user_id: user?.id,
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
          <div className="flex flex-row justify-center items-center gap-2 text-primary border-t p-2 w-full">
            <UserRoundSearch />
            You have no friends
          </div>
        )}
      </div>
    </Card>
  );
};

export default InviteFriends;
