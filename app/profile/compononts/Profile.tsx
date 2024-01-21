"use client";
import React, { useContext } from "react";
import UserInfo from "./userInfo";
import GamesTable from "./gamesTable";
import States from "./states";
import Friends from "./friends";
import { useRouter } from "next/navigation";
import { UserContext } from "@/lib/providers/UserContext";

export default function Profile() {
  const router = useRouter();
  const { currentUser } = useContext(UserContext);

  return currentUser ? (
    <div className="lg:flex justify-center gap-4 p-4">
      <div className="flex flex-col gap-4 mb-4">
        <UserInfo currentUser={currentUser} />
        <GamesTable />
      </div>
      <div className="flex flex-col gap-4">
        <States />
        <Friends />
      </div>
    </div>
  ) : (
    router.push("/login")
  );
}
