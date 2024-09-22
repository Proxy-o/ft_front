"use client";

import { Card } from "@/components/ui/card";
import Invitations from "../components/invitations";
import InviteFriends from "../components/inviteFriend";
import useGetGame from "../hooks/useGetGames";
import getCookie from "@/lib/functions/getCookie";
import Game from "./components/game";

export default function Page() {
  const user_id = getCookie("user_id") || "";

  const { onGoingGame } = useGetGame(user_id || "0", "two");

  return (
    <>
      <div className="w-full h-fit flex flex-col justify-center items-center">
        <div className="text-3xl font-bold">One V One</div>
        <div className="text-xl">Play with your friends</div>
      </div>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="flex flex-col p-4 lg:flex-row w-11/12 h-full lg:justify-center items-center lg:items-start gap-2">
          <Game type={"two"} onGoingGame={onGoingGame}/>
          <div className="lg:w-4/12 w-full lg:max-w-96 h-fit flex flex-col justify-start items-start gap-2">
            <div className="w-full h-full flex flex-col justify-start items-start">
              <Invitations mode="two" />
            </div>
            <div className="w-full h-full mb-8">
              <InviteFriends gameType="two" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
