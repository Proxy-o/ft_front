"use client";

import React, { useRef, useEffect, useState } from "react";
import getCookie from "@/lib/functions/getCookie";
import useGetGame from "../hooks/useGetGames";
import Score from "../components/score";
import Game from "./game";

const Two = ({ type }: { type: string }) => {
  const user_id = getCookie("user_id") || "";

  const { onGoingGame } = useGetGame(user_id || "0", type);

  return (
    <div className="w-full h-fit flex flex-col justify-center items-center">
      <h1 className="text-4xl">Ping Pong</h1>
      {onGoingGame.isSuccess && (
        <>
          {onGoingGame.data.game.user1 && <Score />}
          <Game type={type} />
        </>
      )}
    </div>
  );
};

export default Two;
