"use client";
import React, { use, useContext, useEffect } from "react";
import UserInfo from "./compononts/userInfo";
import GamesTable from "./compononts/gamesTable";
import States from "./compononts/states";
import Friends from "./compononts/friends";
import { useRouter } from "next/navigation";
import Profile from "./compononts/Profile";
import { UserContext } from "@/lib/providers/UserContext";

export default function Page() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const router = useRouter();
  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);
  return <Profile />;
}
