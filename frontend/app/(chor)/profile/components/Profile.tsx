"use client";
import React, { useEffect, useRef, useState } from "react";
import UserInfo from "./userInfo";
import States from "./states";
import useGetUser from "../hooks/useGetUser";
import FriendList from "@/app/(chor)/friends/components/friendList";
import useGetBlocked from "@/app/(chor)/friends/hooks/useGetBlocked";
import useGetFriends from "@/app/(chor)/chat/hooks/useGetFriends";
import ChatCard from "@/app/(chor)/chat/components/chatCard";
import { UserRoundX, XCircle } from "lucide-react";
import TabStates from "./tabStates";
import { Card } from "@/components/ui/card";
import ProfileSkel from "@/components/skeletons/profileSkel";
import ResCard from "@/components/ui/resCard";

export default function Profile({ id }: { id: string }) {
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const { data, isSuccess } = useGetUser(id);
  const { data: sender, isSuccess: isSender } = useGetUser("0");
  const { data: blocked } = useGetBlocked();
  const { data: friends } = useGetFriends(sender?.id);
  const isBlocked = blocked?.some((user: any) => user.id == id);
  const isFriend = friends?.some((user: any) => user.id == id);
  const blocked_by_current_user = blocked?.some((user: any) => {
    if (user.id == id && user.blocked_by_user == true) return true;
  });

  const canEdit = sender && id == sender?.id ? true : false;
  const chatRef = useRef<HTMLDivElement>(null); // Specify the type as React.RefObject<HTMLDivElement>

  useEffect(() => {
    if (isChatOpen && isSender && isSuccess) {
      if (chatRef.current) {
        chatRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }
    }
  }, [isChatOpen, isSender, isSuccess]);

  return (
    <ResCard>
      <div className="relative lg:flex  gap-4 p-4 w-full  ">
        {isSuccess ? (
          <>
            <div className="flex flex-col gap-4  w-full feedLeft ">
              <UserInfo
                user={data}
                canEdit={canEdit}
                current_user_id={sender?.id}
                isBlocked={isBlocked}
                blocked_by_current_user={blocked_by_current_user}
                setChatOpen={setIsChatOpen}
              />
              {isChatOpen && isSender && isSuccess && (
                // get the high of the screen and put it in the bottom
                <Card className="relative  " ref={chatRef}>
                  <XCircle
                    className="absolute z-40 top-[18px] right-[18px] opacity-20 hover:cursor-pointer hover:scale-[1.05] transition duration-300 ease-in-out"
                    onClick={() => setIsChatOpen(false)}
                  />
                  <ChatCard sender={sender} receiver={data} />
                </Card>
              )}
              <div className="">{!isBlocked && <TabStates id={id} />}</div>
            </div>
            <div className="flex flex-col gap-4 mb-6 feedRight">
              <States id={id} />
              {((!isBlocked && isFriend) || sender?.id == id) && (
                <FriendList user_id={id} />
              )}
            </div>
          </>
        ) : (
          <ProfileSkel />
        )}
      </div>
    </ResCard>
  );
}
