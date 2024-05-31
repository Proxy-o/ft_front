"use client";
import getCookie from "@/lib/functions/getCookie";
import { Card } from "@/components/ui/card";
import GamesTable from "../profile/components/gamesTable";
import OneVOne from "./components/gameNav/oneVOne";
import TwoVTwo from "./components/gameNav/twoVTwo";
import TournamentNav from "./components/gameNav/tournament";
import Invitations from "./components/invitations";
import Link from "next/link";
import CheckLogin from "@/components/checkLogin";
import { useEffect } from "react";

export default function Page() {
  const user_id = getCookie("user_id") || "";

  // window.addEventListener('offline', () => {
  //     console.log("offline");
  // }
  // );

  return (
    <div className="relative w-full h-full max-w-[60rem] mx-auto  bg-gre px-4">
      <CheckLogin />
      {/* <GameNav setTab={setTab} tab={tab} /> */}
      <Card className=" flex flex-col justify-center items-center  mx-auto gap-2 p-4 ">
        <div className="pb-2">Modes</div>
        <div className="flex flex-wrap gap-5 justify-center ">
          <Link href="/game/local">
            <div>
              <OneVOne type="local" />
            </div>
          </Link>
          <Link href="/game/oneVone">
            <div>
              <OneVOne type="two" />
            </div>
          </Link>
          <Link href="/game/four">
            <div>
              <TwoVTwo />
            </div>
          </Link>
          <Link href="/game/tournament">
            <div>
              <TournamentNav />
            </div>
          </Link>
        </div>
        <div className="w-full h-full mb-4 ">
          <h1 className="mb-2">Invitations</h1>
          <Invitations mode="all" />
        </div>
        <div className="w-full h-full flex flex-col md:flex-row  justify-center items-center   gap-4">
          <GamesTable id={user_id} />
        </div>
      </Card>
      <div className="w-full h-fit flex flex-row justify-start items-start mt-10"></div>
    </div>
  );
}
