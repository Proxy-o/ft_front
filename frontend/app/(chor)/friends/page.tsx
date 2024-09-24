"use client";
import React, { useEffect } from "react";
import useGetUser from "../profile/hooks/useGetUser";
import { useRouter } from "next/navigation";
import useGetFriends from "../chat/hooks/useGetFriends";
import ChatFriendCard from "../chat/components/chatFriendCard";
import { User } from "@/lib/types";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function Page() {
  const router = useRouter();
  const { data: user, isSuccess } = useGetUser( "0");
  const { data: friends, isSuccess: friendsIsSuccess } = useGetFriends(
    user?.id
  );

  useEffect(() => {
    if (!user && isSuccess) {
      router.push("/login");
    }
  }, [user, isSuccess, router]);

  const friendCount = friends?.length;

  return (
    user && (
      <div className="h-[calc(100vh-7.8rem)] w-full flex flex-col">

        <Card className=" border    flex flex-col     p-1 mx-2 h-full overflow-hidden">
          
          <div className="flex w-full justify-center items-center border-b-2  py-4">
            Friends
            <p className="border bg-primary mx-2 rounded-full size-6  text-center">
              {friendCount}
            </p>
          </div>
          <Link
          href="/friend_requests"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            " ml-0 sm:ml-auto  my-2"
          )}
        >
          Friend Requests
        </Link>
          <div className="overflow-y-auto md:scrollbar scrollbar-thumb-primary/10 scrollbar-w-2 no-scrollbar">
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
        </Card>
      </div>
    )
  );
}
