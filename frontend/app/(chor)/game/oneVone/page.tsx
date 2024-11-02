"use client";

import Invitations from "../components/invitations/invitations";
import InviteFriends from "../components/invitations/inviteFriend";
import useGetGame from "../hooks/game/useGetGames";
import Game from "./components/game";
import useGetUser from "../../profile/hooks/useGetUser";

export default function Page() {
  const { data: user } = useGetUser("0");
  const user_id = user?.id;

  const { onGoingGame } = useGetGame(user_id || "0", "two");

  return (
    <>
      <div className="w-full h-fit min-w-72 flex flex-col justify-center items-center text-white">
        <h1 className="text-3xl text-white md:text-6xl mt-5">
          <span className="text-cyan-500">One</span> Vs{" "}
          <span className="text-purple-500">One</span>
        </h1>

        <div className="text-sm font-light mb-5 mt-3 text-center">
          Invite a friend to play a game of ping pong with you!
        </div>
      </div>
      <div className="w-full min-w-72 h-fit flex flex-row justify-center items-start">
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
