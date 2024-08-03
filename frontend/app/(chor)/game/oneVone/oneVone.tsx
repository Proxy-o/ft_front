"use client";

import React from "react";
import getCookie from "@/lib/functions/getCookie";
import useGetGame from "../hooks/useGetGames";
import Game from "./game";

const Two = ({ type }: { type: string }) => {
  const user_id = getCookie("user_id") || "";

  const { onGoingGame } = useGetGame(user_id || "0", type);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      {onGoingGame.isSuccess && (
        <>
          <Game type={type} />
        </>
      )}
    </div>
  );
};

export default Two;
