"use client";
import React from "react";
import useGetUser from "../profile/hooks/useGetUser";
import useGetFriends from "../chat/hooks/useGetFriends";
import ChatFriendCard from "../chat/components/chatFriendCard";
import { User } from "@/lib/types";
import Link from "next/link";
import ResCard from "@/components/ui/resCard";

export default function Page() {
  const { data: user } = useGetUser("0");
  const { data: friends, isSuccess: friendsIsSuccess } = useGetFriends(
    user?.id
  );

  const friendCount = friends?.length;

  return (
    user && (
      <ResCard>
        <div className="flex flex-col h-full">
          <div className="flex w-full justify-center items-center border-b-2  py-4">
            Friends
            <p className="border  mx-2 rounded-lg  text-center">
              {friendCount}
            </p>
          </div>
          {/* <div className="w-full flex justify-end">
            <Link
              href="/friend_requests"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "ml-0 sm:ml-auto  my-2 "
              )}
            >
              Friend Requests
            </Link>
          </div> */}
          <div className="p-1 mx-2 h-full overflow-y-auto  no-scrollbar">
            {friendsIsSuccess && friends.length > 0 ? (
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
              })
            ) : (
              <div className="w-full text-center h-16 flex justify-center items-center bg-primary/5">
                sorry you don&apos;t have any friends
              </div>
            )}
          </div>
          
        </div>
      </ResCard>
    )
  );
}
