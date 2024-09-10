import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { User } from "@/lib/types";
import { Activity, Clock, Users } from "lucide-react";
import React, { use, useEffect, useState } from "react";
import EditProfile from "./editProfile";
import ProfileAvatar from "./profileAvatar";

import useAddFriend from "../../friends/hooks/useAddFriend";
import useUnfriend from "@/app/(chor)/friends/hooks/useUnfriend";
import useGetFriends from "@/app/(chor)/chat/hooks/useGetFriends";
import useGetFrdReq from "@/app/(chor)/friends/hooks/useGetFrReq";
import useBlock from "@/app/(chor)/friends/hooks/useBlockUser";
import useUnBlock from "@/app/(chor)/friends/hooks/useUnBlockUser";
import useAcceptFriend from "@/app/(chor)/friends/hooks/useAcceptFriend";
import useLogout from "@/app/(auth)/login/hooks/useLogout";
import useReject from "../../friends/hooks/useDeclineReq";
import useSendInvitation from "../../game/hooks/useSendInvitation";
import useInvitationSocket from "@/app/(chor)/game/hooks/sockets/useInvitationSocket";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

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
  const { mutate: addFriend } = useAddFriend();
  const { mutate: unfriend } = useUnfriend();
  const { mutate: block } = useBlock();
  const { mutate: unBlock } = useUnBlock();
  const { data: friendReq } = useGetFrdReq();
  const { mutate: acceptFriend } = useAcceptFriend();
  const { mutate: reject } = useReject();
  const { data: friends, isSuccess } = useGetFriends(current_user_id);
  const { mutate: logout } = useLogout();
  const { mutate: invite } = useSendInvitation();
  const { handelSendInvitation } = useInvitationSocket();
  const router = useRouter();

  const id = user.id;
  const isFriend =
    isSuccess && friends.some((friend: User) => friend.id === id);

  const isReqSent = friendReq?.some((req: any) => req.to_user.id === id);
  const [recReqId, setRecReqId] = useState<string | null>(null);
  const [sendReqId, setSendReqId] = useState<string | null>(null);
  useEffect(() => {
    if (friendReq) {
      console.log(friendReq);
      const req = friendReq.find((req: any) => req.from_user.id === id);
      const sendReq = friendReq.find((req: any) => req.to_user.id === id);
      if (req) {
        setRecReqId(req.id);
      } else {
        setRecReqId(null);
      }
      if (sendReq) {
        setSendReqId(sendReq.id);
      } else {
        setSendReqId(null);
      }
    }
  }, [friendReq]);

  const handleLogout = () => {
    logout();
  };
  return (
    <Card
      className={cn(
        "relative rounded-lg p-2 md:p-6 md:flex max-w-7xl",
        isBlocked && " cursor-not-allowed"
      )}
    >
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
              className="bg-red-800/85 relative z-40"
              variant={"default"}
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

        <div className="flex justify-around items-center w-full mt-6 ">
          <TooltipProvider delayDuration={0}>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="flex flex-col justify-center items-center ">
                  <Activity className="mb-2" />
                  <p
                    className={cn(
                      "text-sm sm:text-m",
                      user.status === "online" && "text-green-500"
                    )}
                  >
                    {user.status}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{user.status}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col justify-center items-center  ">
                  <Users className="mb-2 ml-1" />
                  <p className="text-sm sm:text-m">{friends?.length}</p>
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
                <div className="flex flex-col justify-center items-center ">
                  <Clock className="mb-2" />
                  <p className="text-sm sm:text-m">
                    {user.date_joined?.split("T")[0]}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Member since</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex justify-center items-center space-x-3 ">
          {canEdit ? (
            <Button
              className="mt-6 w-full bg-red-500/30"
              variant="outline"
              onClick={() => handleLogout()}
            >
              Logout
            </Button>
          ) : (
            <>
              {!isFriend && !isBlocked && !recReqId ? (
                <>
                  <Button
                    className="mt-6 w-full bg-green-400/20"
                    variant="outline"
                    onClick={() => addFriend(id)}
                    disabled={isReqSent || isBlocked}
                  >
                    Add Friend
                  </Button>
                  {sendReqId && (
                    <Button
                      className="mt-6 w-full bg-red-400/20"
                      variant="outline"
                      onClick={() => {
                        console.log(recReqId);
                        reject(sendReqId);
                      }}
                    >
                      Cancel Request
                    </Button>
                  )}
                </>
              ) : (
                recReqId && (
                  <>
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
                    <Button
                      className="mt-6 w-full bg-red-400/20"
                      variant="outline"
                      onClick={() => reject(recReqId)}
                    >
                      Decline
                    </Button>
                  </>
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
                  <Button
                    className="mt-6 w-full"
                    variant="outline"
                    onClick={() => {
                      invite({
                        userid: id,
                        gameType: "two",
                      });
                      handelSendInvitation(id, "two");
                      router.push("/game/oneVone");
                    }}
                  >
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
