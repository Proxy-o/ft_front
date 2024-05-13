"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import useSearchFriend from "../hooks/useSearchFriend";
import { User } from "@/lib/types";
import Link from "next/link";
import ChatFriendCard from "@/app/chat/components/chatFriendCard";

export default function SearchFriend() {
  const { mutate: search, isPending, isSuccess, data } = useSearchFriend();
  const [resVisible, setResVisible] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    search({ slug: e.target.value });
  };
  return (
    <div
      className=" mx-auto w-9/12 mt-2  relative "
      onBlur={() => setTimeout(() => setResVisible(false), 200)}
    >
      <div className=" h-12  w-full ">
        <Search size={20} className="absolute end-2 top-4 " />
        <Input
          placeholder="Search"
          className="h-full"
          onChange={(e) => handleChange(e)}
          onFocus={() => setResVisible(true)}
        />
      </div>
      <div className=" absolute z-50 w-full dark:bg-black bg-gray-300 top-14">
        {/* show friend list */}
        {isSuccess && resVisible && (
          <>
            {isPending ? (
              <div>Loading...</div>
            ) : (
              <div>
                {data.map((friend: User) => (
                  <Link
                    key={friend.id}
                    className="cursor-pointer"
                    href={`/profile/${friend.id.toString()}`}
                  >
                    <ChatFriendCard friend={friend} setReceiverId={() => {}} />
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}