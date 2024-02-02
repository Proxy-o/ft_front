"use client";
import React, { use, useContext, useEffect, useRef, useState } from "react";
import UserInfo from "./userInfo";
import GamesTable from "./gamesTable";
import States from "./states";
import useGetUser from "../hooks/useGetUser";
import getCookie from "@/lib/functions/getCookie";
import FriendList from "@/app/friends/components/friendList";
import useGetBlocked from "@/app/friends/hooks/useGetBlocked";
import useGetFriends from "@/app/chat/hooks/useGetFriends";
import ChatCard from "@/app/chat/components/chatCard";
import { Cross, MessageCircle, XCircle } from "lucide-react";

export default function Profile({ id }: { id: string }) {
  const id_cookie = getCookie("user_id") as string;
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const { data, isSuccess } = useGetUser(id);
  const { data: blocked } = useGetBlocked();
  const { data: friends } = useGetFriends(id_cookie);
  const isBlocked = blocked?.some((user: any) => user.id == id);
  const isFriend = friends?.some((user: any) => user.id == id);
  const blocked_by_current_user = blocked?.some((user: any) => {
    if (user.id == id && user.blocked_by_user == true) return true;
  });

  const logged_in = getCookie("logged_in");

  const canEdit = logged_in === "yes" && id === id_cookie ? true : false;
  return (
    <div className="relative lg:flex justify-center gap-4 p-4 ">
      {isSuccess && (
        <>
          <div className="flex flex-col gap-4 mb-4 sm:min-w-[40rem]">
            <UserInfo
              user={data}
              canEdit={canEdit}
              current_user_id={id_cookie || "0"}
              isBlocked={isBlocked}
              blocked_by_current_user={blocked_by_current_user}
              setChatOpen={setIsChatOpen}
            />
            {isChatOpen && (
              // get the high of the screen and put it in the bottom
              <div className="relative">
                <XCircle
                  className="absolute z-50 -top-3 -left-2 text-red-600 hover:cursor-pointer hover:scale-[1.05] transition duration-300 ease-in-out"
                  onClick={() => setIsChatOpen(false)}
                />
                <ChatCard
                  senderId={parseInt(id_cookie)}
                  receiverId={parseInt(id)}
                />
              </div>
            )}
            {!isBlocked && <GamesTable />}
          </div>
          <div className="flex flex-col gap-4">
            <States />
            {((!isBlocked && isFriend) || id_cookie == id) && (
              <FriendList user_id={id} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
