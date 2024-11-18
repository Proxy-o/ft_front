"use client";
import { Card } from "@/components/ui/card";
import Invitations from "./components/invitations/invitations";
import TabStates from "../profile/components/tabStates";
import useGetUser from "../profile/hooks/useGetUser";
import { useState } from "react";
import LocalNav from "./components/gameNav/localNav";
import OnlineNav from "./components/gameNav/onlineNav";
import ReturnArrow from "./components/gameNav/returnArrow";
import MainNav from "./components/gameNav/mainNav";

export default function Page() {
  const { data: user } = useGetUser("0");
  const user_id = user?.id;

  const [mode, setMode] = useState<"local" | "online" | "main">("main");
  return (
    <div className="w-full h-full flex flex-col justify-start items-center gap-4">
      <h1 className="text-3xl text-white md:text-6xl mt-5 mb-16">
        <span className="text-cyan-500">Ping</span>{" "}
        <span className="text-purple-500">Pong</span>
      </h1>
      <Card
        className={`flex flex-col rounded-lg p-4 w-full items-center justify-center min-h-[280px] md:h-[280px]
      ${
        mode == "online"
          ? "h-[370px] transition-all duration-500 ease-in-out"
          : "h-[370px] transition-all duration-500 ease-in-out overflow-hidden"
      }`}
      >
        <div className="relative w-full h-full flex flex-col justify-center items-center -top-14 md:top-0 text-white scale-75 md:scale-100">
          <ReturnArrow setMode={setMode} mode={mode} />
          <LocalNav setMode={setMode} mode={mode} />
          <OnlineNav setMode={setMode} mode={mode} />
          <MainNav setMode={setMode} mode={mode} />
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
