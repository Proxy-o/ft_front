"use client";
import getCookie from "@/lib/functions/getCookie";

import useGetUser from "../profile/hooks/useGetUser";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Two from "./components/two";
import OneOffline from "./components/oneOffline";
import Four from "./components/four";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import GamesTable from "../profile/components/gamesTable";
import OneVOne from "./components/gameNav/oneVOne";
import TwoVTwo from "./components/gameNav/twoVTwo";
import TournamentNav from "./components/gameNav/tournament";
import Tournament from "./components/tournament";
import Invitations from "./components/invitations";
import useGameSocket from "@/lib/hooks/useGameSocket";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
export default function Page() {
  const user_id = getCookie("user_id") || "";
  const { data: user, isSuccess, isLoading } = useGetUser(user_id || "0");
  const { newNotif } = useGameSocket();
  const router = useRouter();
  const [tab, setTab] = useState("tab");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user && isSuccess) {
      router.push("/login");
    }
  }, [user, isSuccess, router]);

  useEffect(() => {
    const notif = newNotif();
    if (notif) {
      const parsedMessage = JSON.parse(notif.data);
      const message = parsedMessage?.message.split(" ");
      if (message[0] === "/start") {
        queryClient.invalidateQueries({ queryKey: ["game"] });
        toast.success("The game has started");
      }
    }
  }, [newNotif()?.data]);

  if (isLoading) return <div>loading...</div>;

  // window.addEventListener('offline', () => {
  //     console.log("offline");
  // }
  // );

  return (
    <div className="relative w-full h-full">
      {/* <GameNav setTab={setTab} tab={tab} /> */}
      <Card className="w-fit h-fit flex flex-col justify-start items-start p-2 mx-auto mt-12 gap-2">
        {tab !== "tab" && (
          <div
            className="w-15 h-15 bg-background flex flex-col justify-center items-center rounded-xl shadow-primary shadow-sm"
            onClick={() => setTab("tab")}
          >
            <ArrowLeft size={30} />
          </div>
        )}
        {tab === "tab" && (
          <>
            <div className="p-4">Modes</div>
            <div className="flex flex-row gap-4">
              <div onClick={() => setTab("local")}>
                <OneVOne type="local" />
              </div>
              <div onClick={() => setTab("two")}>
                <OneVOne type="two" />
              </div>
              <div onClick={() => setTab("four")}>
                <TwoVTwo />
              </div>
              <div onClick={() => setTab("tournament")}>
                <TournamentNav />
              </div>
            </div>
            <div className="w-full h-full flex flex-row justify-start items-start gap-4">
              <div className="w-1/2 h-full flex flex-col justify-start items-start">
                <GamesTable id={user_id} />
              </div>
              <div className="w-1/2 h-full flex flex-col justify-start items-start">
                <div className="p-4">Invitations</div>
                <Invitations setTab={setTab} />
              </div>
            </div>
          </>
        )}
        {tab === "two" && (
          <div className="flex flex-col w-full h-full justify-start items-center">
            <Two type="two" />
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
        {tab === "tournament" && (
          <>
            <div className="flex flex-col w-full h-full justify-start items-center left-0">
              <Tournament />
            </div>
          </>
        )}
      </Card>
      <div className="w-full h-fit flex flex-row justify-start items-start mt-10"></div>
    </div>
  );
}
