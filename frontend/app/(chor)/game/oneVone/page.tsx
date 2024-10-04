"use client";

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
      <div className="w-full h-fit min-w-72 flex flex-col justify-center items-center">
        <h1 className="text-3xl md:text-7xl mt-5">One V One</h1>
        <div className="text-sm font-light mb-5 mt-3 text-center">
          Invite a friend to play a game of ping pong with you!
        </div>
      </div>
      <div className="w-full min-w-72 h-full flex flex-row justify-center items-center">
        <div className="flex flex-col p-4 w-full md:justify-center items-center md:items-start gap-2">
          <Game type={"two"} onGoingGame={onGoingGame} />
          <div className="w-full h-fit flex flex-col md:flex-row justify-start items-start gap-2">
            <div className="w-full h-fit flex flex-col justify-start items-start">
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
