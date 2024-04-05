"use client";
import React, { useEffect } from "react";
import FriendRequests from "./components/friendRequests";
import FriendList from "./components/friendList";
import getCookie from "@/lib/functions/getCookie";
import useGetUser from "../profile/hooks/useGetUser";
import { useRouter } from "next/navigation";
import useGetFriends from "../chat/hooks/useGetFriends";
import ChatFriendCard from "../chat/components/chatFriendCard";
import { User } from "@/lib/types";
import { Card } from "@/components/ui/card";

export default function Page() {
  const user_id = getCookie("user_id");
  const router = useRouter();
  const { data: friends, isSuccess: friendsIsSuccess } = useGetFriends(
    user_id || "0"
  );

  const { data: user, isSuccess } = useGetUser(user_id || "0");
  useEffect(() => {
    if (!user && isSuccess) {
      router.push("/login");
    }
  }, [user, isSuccess, router]);

  const frndCount = friends?.length;

  return (
    user && (
      <div className="flex gap-1 h-full">
        <FriendRequests />
        <div className="flex flex-col w-3/5 border  overflow-y-auto h-full p-1">
          <Card className=" w-full border h-12 flex items-center justify-center ">
            Friends{" "}
            <p className="border bg-primary mx-2 rounded-sm p-1">{frndCount}</p>
          </Card>
          {friendsIsSuccess &&
            friends.map((friend: User) => {
              return (
                <div key={friend.id} className="cursor-pointer ">
                  <ChatFriendCard friend={friend} setReceiverId={() => {}} />
                </div>
              );
            })}
        </div>
      </div>
    )
  );
}
