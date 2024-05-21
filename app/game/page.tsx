import getCookie from "@/lib/functions/getCookie";

import useGetUser from "../profile/hooks/useGetUser";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import GamesTable from "../profile/components/gamesTable";
import OneVOne from "./components/gameNav/oneVOne";
import TwoVTwo from "./components/gameNav/twoVTwo";
import TournamentNav from "./components/gameNav/tournament";
import Invitations from "./components/invitations";
import Link from "next/link";
import CheckLogin from "@/components/checkLogin";
export default function Page() {
  const user_id = getCookie("user_id") || "";

  // window.addEventListener('offline', () => {
  //     console.log("offline");
  // }
  // );

  return (
    <div className="relative w-full h-full">
      <CheckLogin />
      {/* <GameNav setTab={setTab} tab={tab} /> */}
      <Card className="w-fit h-fit flex flex-col justify-start items-start p-2 mx-auto mt-12 gap-2">
        <div className="p-4">Modes</div>
        <div className="flex flex-row gap-4">
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
        <div className="w-full h-full flex flex-row justify-start items-start gap-4">
          <div className="w-1/2 h-full flex flex-col justify-start items-start">
            {/* <GamesTable id={user_id} /> */}
          </div>
          <div className="w-1/2 h-full flex flex-col justify-start items-start">
            <div className="p-4">Invitations</div>
            <Invitations mode="all" />
          </div>
        </div>
      </Card>
      <div className="w-full h-fit flex flex-row justify-start items-start mt-10"></div>
    </div>
  );
}
