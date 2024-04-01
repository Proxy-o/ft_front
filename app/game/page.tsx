"use client";
import getCookie from "@/lib/functions/getCookie";

import useGetUser from "../profile/hooks/useGetUser";
import { useEffect, useState } from "react";
import Invitations from "./components/invitations";
import InviteFriend from "./components/inviteFriend";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import GameNav from "./components/gameNav";
import OneOnline from "./components/oneOnline";
import OneOffline from "./components/oneOffline";
export default function Page() {
  const user_id = getCookie("user_id") || "";
  const { data: user, isSuccess, isLoading } = useGetUser(user_id || "0");
  const router = useRouter();
  const [tab, setTab] = useState("local");

  useEffect(() => {
    if (!user && isSuccess) {
      router.push("/login");
    }
  }, [user, isSuccess, router]);

  if (isLoading) return <div>loading...</div>;

  // window.addEventListener('offline', () => {
  //     console.log("offline");
  // }
  // );

  return (
    <>
      <GameNav setTab={setTab} tab={tab} />
      <div className="w-full h-fit flex flex-row justify-start items-start mx-auto mt-10">
        {tab === "online" && (
          <div className="flex flex-col w-full h-full justify-start items-center">
            <OneOnline />
          </div>
        )}
        {tab === "local" && (
          <>
            <OneOffline />
          </>
        )}
      </div>
    </>
  );
}
