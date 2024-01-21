"use client";
import React from "react";
import UserInfo from "./compononts/userInfo";
import GamesTable from "./compononts/gamesTable";
import States from "./compononts/states";
import Friends from "./compononts/friends";
import { useRouter } from "next/navigation";
import Profile from "./compononts/Profile";

export default function page() {
  return <Profile />;
}
