"use client";
import { Card } from "@/components/ui/card";
import OneVOne from "./components/gameNav/oneVOne";
import TwoVTwo from "./components/gameNav/twoVTwo";
import Invitations from "./components/invitations";
import Link from "next/link";
import TabStates from "../profile/components/tabStates";
import useGetUser from "../profile/hooks/useGetUser";
import { useState } from "react";
import LocalNav from "./components/gameNav/localNav";
import OnlineNav from "./components/gameNav/onlineNav";

export default function Page() {
  const { data: user } = useGetUser("0");
  const user_id = user?.id;

  const [mode, setMode] = useState<"local" | "online" | "main">("main");
  return (
    <div className="w-full h-full flex flex-col justify-start items-center gap-5">
      <h1 className="text-3xl text-white md:text-6xl mt-5">Ping Pong</h1>
      <Card className="flex flex-col gap-5 rounded-lg p-4 h-[690px] min-h-[650px] md:min-h-48 mb-2 w-full items-center justify-center">
        <div className="pb-2 w-full">Modes</div>
        <div className="relative w-full h-full flex flex-col justify-center items-center text-white">
          <LocalNav setMode={setMode} mode={mode} />
          <OnlineNav setMode={setMode} mode={mode} />
          <div
            className={`absolute flex flex-col md:flex-row gap-7 items-center justify-center h-fit w-full p-6 rounded-md ${
              mode === "main"
                ? "left-0 transition-all duration-500 ease-in-out"
                : "-left-[3000px] transition-all duration-500 ease-in-out"
            }`}
          >
            <div onClick={() => setMode("local")} className="cursor-pointer">
              <OneVOne type="local" />
            </div>
            <div onClick={() => setMode("online")} className="cursor-pointer">
              <OneVOne type="online" />
            </div>

            <Link href="/game/twoVtwo">
              <div>
                <TwoVTwo />
              </div>
            </Link>
          </div>
        </div>
      </Card>
        <div className="w-full h-fit feedBot ">
          <Invitations mode="all" />
        </div>
        <div className="h-full w-full flex flex-col md:flex-row gap-4 feedLeft">
          <TabStates id={user_id} />
        </div>
    </div>
  );
}
