"use client";
import React, { useEffect } from "react";
import FriendRequests from "./components/friendRequests";
import getCookie from "@/lib/functions/getCookie";
import useGetUser from "../profile/hooks/useGetUser";
import { useRouter } from "next/navigation";
import useGetFriends from "../chat/hooks/useGetFriends";
import ChatFriendCard from "../chat/components/chatFriendCard";
import { User } from "@/lib/types";
import { Card } from "@/components/ui/card";
import Link from "next/link";

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

  const friendCount = friends?.length;

  return (
    user && (
      <div className="flex gap-1 overflow-auto h-full">
        <Card className=" w-full border    flex flex-col    my-3 p-1 mr-2 ">
          <div className="flex w-full justify-center items-center border-b-2 mb-1 p-2">
            Friends
            <p className="border bg-primary mx-2 rounded-full size-6  text-center">
              {friendCount}
            </p>
          </div>
          <div className="overflow-y-auto">
            {friendsIsSuccess &&
              friends.map((friend: User) => {
                return (
                  <Link
                    key={friend.id}
                    className="cursor-pointer"
                    href={`/profile/${friend.id.toString()}`}
                  >
                    <ChatFriendCard friend={friend} setReceiverId={() => {}} />
                  </Link>
                );
              })}
          </div>
        </Card>
        <FriendRequests />
      </div>
    )
  );
}
