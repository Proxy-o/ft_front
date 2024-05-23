"use client";

import React from "react";

import getCookie from "@/lib/functions/getCookie";
import Score from "../components/score";
import useGetFourGame from "../hooks/useGetFourGame";

import Game from "./game";

const Four = () => {
  const user_id = getCookie("user_id") || "";
  const { onGoingGame } = useGetFourGame(user_id || "0");

  return (
    <div className="p-4 h-fit  flex flex-col mx-auto justify-center w-full">
      <h1 className="text-4xl mx-auto">Four Player Game</h1>

      {onGoingGame.isSuccess && (
        <>
          {/* {onGoingGame.data.game.user1 && <Score type="four" />} */}
          <Game type="four" />
        </>
      )}
    </div>
  );
};

export default Four;
