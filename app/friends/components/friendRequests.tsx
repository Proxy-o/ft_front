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
import getCookie from "@/lib/functions/getCookie";

export default function FriendRequests() {
  const { data, isSuccess } = useGetFrdReq();
  const { mutate: acceptFriend } = useAcceptFriend();
  const { mutate: reject } = useReject();
  const user_id = getCookie("user_id") as string;

  const filteredData =
    isSuccess &&
    data.filter(({ to_user }: { to_user: User }) => to_user.id == user_id);
  const reqCount = filteredData.length;
  return (
    isSuccess && (
      <div className="flex flex-col h-full w-full">
        <Card className=" w-full border h-12 flex items-center justify-center my-2">
          Friend Requests{" "}
          <p className="border bg-primary mx-2 rounded-sm p-1">{reqCount}</p>
        </Card>
        {reqCount !== 0 && (
          <Card className="m-2 flex-1 flex justify-center items-center">
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
                          user_id,
                          friend: from_user,
                          to_accept_id: id,
                        })
                      }
                    />
                    <XCircle
                      className="text-red-500 hover:text-red-400 hover:scale-[1.1] transition-all  mr-2 cursor-pointer"
                      onClick={() => reject(id)}
                    />
                  </div>
                </div>
              )
            )}
          </Card>
        )}
      </div>
    )
  );
}
