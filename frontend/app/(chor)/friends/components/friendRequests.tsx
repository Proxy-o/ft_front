"use client";
import React from "react";
import useGetFrdReq from "../hooks/useGetFrReq";
import { User } from "@/lib/types";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, XCircle } from "lucide-react";
import useAcceptFriend from "../hooks/useAcceptFriend";
import useReject from "../hooks/useDeclineReq";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useGetUser from "../../profile/hooks/useGetUser";

export default function FriendRequests() {
  const { data, isSuccess } = useGetFrdReq();
  const { mutate: acceptFriend } = useAcceptFriend();
  const { mutate: reject } = useReject();
  const { data: user } = useGetUser("0");

  const filteredData =
    isSuccess &&
    data.filter(({ to_user }: { to_user: User }) => to_user.id == user?.id);
  const reqCount = filteredData.length;
  return (
    isSuccess && (
      <Card className=" w-full border h-full    flex flex-col     p-1 overflow-auto">
        <div className="flex w-full justify-center items-center border-b-2  py-4">
          Friend Requests
          <p className="border bg-primary mx-2 rounded-full size-6  text-center">
            {reqCount}
          </p>
        </div>
        <Link
          href="/friends"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            " ml-auto my-2"
          )}
        >
          Friends
        </Link>
        {reqCount !== 0 ? (
          <>
            {filteredData.map(
              ({ id, from_user }: { id: string; from_user: User }) => (
                <div
                  key={id}
                  className="flex hover:scale-[1.005] transition-all bg-secondary rounded-sm mb-1 p-2 "
                >
                  <Link
                    className=" w-full text-white  flex items-center flex-1 "
                    href={`profile/${from_user.id}`}
                  >
                    <Avatar className="rounded-sm mr-4 hover:scale-[1.1] transition-all">
                      <AvatarImage
                        src={from_user.avatar}
                        alt="profile image"
                        className="rounded-sm"
                      />
                      <AvatarFallback className="rounded-sm">PF</AvatarFallback>
                    </Avatar>
                    <p className="text-zinc-700 dark:text-zinc-50">
                      {from_user.username}
                    </p>
                  </Link>

                  <div className="flex items-center">
                    <CheckCircle
                      className="text-green-500 hover:text-green-400 hover:scale-[1.1] transition-all mr-2 cursor-pointer"
                      onClick={() =>
                        acceptFriend({
                          user_id: user?.id,
                          friend: from_user,
                          to_accept_id: id,
                        })
                      }
                    />
                    <XCircle
                      className="text-red-500 hover:text-red-400 hover:scale-[1.1] transition-all  mr-2 cursor-pointer"
                      onClick={() =>
                        reject({ to_reject_id: id, friend: from_user })
                      }
                    />
                  </div>
                </div>
              )
            )}
          </>
        ) : (
          <div className="w-full text-center h-16 flex justify-center items-center bg-primary/5">
            You don&apos;t have any requests
          </div>
        )}
      </Card>
    )
  );
}
