"use client";
import React, { useEffect, useRef, useState } from "react";
import UserInfo from "./userInfo";
import States from "./states";
import useGetUser from "../hooks/useGetUser";
import getCookie from "@/lib/functions/getCookie";
import FriendList from "@/app/(chor)/friends/components/friendList";
import useGetBlocked from "@/app/(chor)/friends/hooks/useGetBlocked";
import useGetFriends from "@/app/(chor)/chat/hooks/useGetFriends";
import ChatCard from "@/app/(chor)/chat/components/chatCard";
import { UserRoundX, XCircle } from "lucide-react";
import TabStates from "./tabStates";
import { Card } from "@/components/ui/card";
import useGetStates from "../hooks/useGateState";

export default function Profile({ id }: { id: string }) {
  const id_cookie = getCookie("user_id") as string;
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // get the data for the same user or the user that is being visited
  const { data, isSuccess } = useGetUser(id);
  // get the data for the user that is logged in
  const { data: sender, isSuccess: isSender } = useGetUser(id_cookie);
  const { data: blocked } = useGetBlocked();
  const { data: friends } = useGetFriends(id_cookie);
  const isBlocked = blocked?.some((user: any) => user.id == id);
  const isFriend = friends?.some((user: any) => user.id == id);
  const blocked_by_current_user = blocked?.some((user: any) => {
    if (user.id == id && user.blocked_by_user == true) return true;
  });

  const logged_in = getCookie("logged_in");
  const canEdit = logged_in === "yes" && id === id_cookie ? true : false;
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

  return !data && isSender ? (
    <div className="flex flex-col w-full  h-full justify-center  items-center gap-2">
      <UserRoundX size={80} className="text-red-400" />
      No User found.
    </div>
  ) : (
    <Card className="max-w-[60rem] mx-auto  ">
      <div className="relative lg:flex justify-center gap-4 p-4 w-full  ">
        {isSuccess && (
          <>
            <div className="flex flex-col gap-4   w-full ">
              <UserInfo
                user={data}
                canEdit={canEdit}
                current_user_id={id_cookie || "0"}
                isBlocked={isBlocked}
                blocked_by_current_user={blocked_by_current_user}
                setChatOpen={setIsChatOpen}
              />
              {isChatOpen && isSender && isSuccess && (
                // get the high of the screen and put it in the bottom
                <div className="relative  " ref={chatRef}>
                  <XCircle
                    className="absolute z-40 top-2 right-2 text-red-600 hover:cursor-pointer hover:scale-[1.05] transition duration-300 ease-in-out"
                    onClick={() => setIsChatOpen(false)}
                  />
                  <ChatCard sender={sender} receiver={data} />
                </div>
              )}
              <div className="">{!isBlocked && <TabStates id={id} />}</div>
            </div>
            <div className="flex flex-col gap-4 mb-6">
              <States id={id} />
              {((!isBlocked && isFriend) || id_cookie == id) && (
                <FriendList user_id={id} />
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
