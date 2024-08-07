"use client";
import getCookie from "@/lib/functions/getCookie";
import { Card } from "@/components/ui/card";
import OneVOne from "./components/gameNav/oneVOne";
import TwoVTwo from "./components/gameNav/twoVTwo";
import TournamentNav from "./components/gameNav/tournament";
import Invitations from "./components/invitations";
import Link from "next/link";
import TabStates from "../profile/components/tabStates";

export default function Page() {
  const user_id = getCookie("user_id") || "";

  // window.addEventListener('offline', () => {
  //     console.log("offline");
  // }
  // );

  return (
    <div className="relative w-full max-w-[60rem] mx-auto   ">
      {/* <GameNav setTab={setTab} tab={tab} /> */}
      <Card className=" flex flex-col justify-center items-center  mx-auto gap-2 p-4 h-full ">
        <div className="pb-2  w-full">Modes</div>
        <div className="flex flex-wrap gap-5 justify-center  max-h-full  p-6  bg-secondary/40 rounded-md">
          <Link href="/game/local" >
            <div>
              <OneVOne type="local" />
            </div>
          </Link>
          <Link href="/game/oneVone" >
            <div>
              <OneVOne type="two" />
            </div>
          </Link>
          <Link href="/game/twoVtwo" >
            <div>
              <TwoVTwo />
            </div>
          </Link>
          <Link href="/game/tournament" >
            <div>
              <TournamentNav />
            </div>
          </Link>
        </div>
        <div className="w-full  ">
          <Invitations mode="all" />
        </div>
        <div className=" mt-6 h-full  w-full flex flex-col md:flex-row      gap-4">
          <TabStates id={user_id} />
        </div>
      </Card>
    </div>
  );
}
