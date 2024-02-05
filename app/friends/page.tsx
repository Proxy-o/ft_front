"use client";
import React, { use, useEffect } from "react";
import FriendRequests from "./components/friendRequests";
import FriendList from "./components/friendList";
import getCookie from "@/lib/functions/getCookie";
import useGetUser from "../profile/hooks/useGetUser";
import { useRouter } from "next/navigation";

export default function Page() {
  const user_id = getCookie("user_id");
  const router = useRouter();

  const { data: user, error, isSuccess } = useGetUser(user_id || "0");
  useEffect(() => {
    if (!user && isSuccess) {
      router.push("/login");
    }
  }, [user, isSuccess, router]);

  return (
    user && (
      <>
        <FriendList user_id={user_id || "0"} />
        <FriendRequests />
      </>
    )
  );
}
