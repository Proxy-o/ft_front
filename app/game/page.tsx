"use client";
import getCookie from "@/lib/functions/getCookie";

import useGetUser from "../profile/hooks/useGetUser";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GameNav from "./components/gameNav";
import OneOnline from "./components/oneOnline";
import OneOffline from "./components/oneOffline";
import Four from "./components/four";
export default function Page() {
  const user_id = getCookie("user_id") || "";
  const { data: user, isSuccess, isLoading } = useGetUser(user_id || "0");
  const router = useRouter();
  const [tab, setTab] = useState("four");

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
    <div className="relative w-full h-full">
      <GameNav setTab={setTab} tab={tab} />
      <div className="w-full h-fit flex flex-row justify-start items-start mt-10">
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
        {tab === "four" && (
          <>
            <div className="flex flex-col w-full h-full justify-start items-cente left-0">
              <Four />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
