"use client";

import { UserContext } from "@/lib/providers/UserContext";
import Profile from "./compononts/Profile";
import { useContext, useEffect } from "react";
import getCookie from "@/lib/functions/getCookie";
import useGetUser from "./hooks/useGetUser";
import { useRouter } from "next/navigation";

export default function Page() {
  const user_id = getCookie("user_id");
  const logged_in = getCookie("logged_in");

  const router = useRouter();
  if (logged_in !== "yes") router.push("/login");

  return <Profile id={user_id || "0"} />;
}
