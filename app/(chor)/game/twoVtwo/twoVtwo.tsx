"use client";

import React, { useRef } from "react";

import getCookie from "@/lib/functions/getCookie";

import useGetFourGame from "../hooks/useGetFourGame";
import Game from "./game";


const Four = () => {
  const user_id = getCookie("user_id") || "";
  const gameStartedRef = useRef(false);

  const { onGoingGame } = useGetFourGame(user_id || "0");

  return (
    <div className="p-4 h-fit  flex flex-col mx-auto justify-center w-full">
      <h1 className="text-4xl mx-auto">Four Player Game</h1>

      {onGoingGame.isSuccess && (
        <>
          {/* {onGoingGame.data.game.user1 && <Score type="four" />} */}
          <Game gameStartedRef={gameStartedRef} />
          {/* </Game> */}
        </>
      )}
    </div>
  );
};

export default Four;
