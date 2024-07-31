"use client";

import React, { useEffect, useRef, useState } from "react";

import getCookie from "@/lib/functions/getCookie";

import useGetFourGame from "../hooks/useGetFourGame";
import Game from "./game";
import useInvitationSocket from "@/app/(chor)/game/hooks/useInvitationSocket";
import NoGame from "../components/noGame";

const Four = () => {
  const user_id = getCookie("user_id") || "";
  const gameStartedRef = useRef(false);
  const state = useRef<string>("none");

  const [gameChange, setGameChange] = useState(false);

  const { onGoingGame } = useGetFourGame(user_id || "0");

  useEffect(() => {
    if (
      onGoingGame.data?.game.user1 ||
      onGoingGame.data?.game.user2 ||
      onGoingGame.data?.game.user3 ||
      onGoingGame.data?.game.user4
    ) {
      setGameChange(true);
    } else {
      setGameChange(false);
    }
  }, [
    onGoingGame.data?.game.user1,
    onGoingGame.data?.game.user2,
    onGoingGame.data?.game.user3,
    onGoingGame.data?.game.user4,
  ]);

  const { newNotif } = useInvitationSocket();

  useEffect(() => {
    if (newNotif()) {
      const notif = newNotif();
      const parsedMessage = JSON.parse(notif?.data);
      const message = parsedMessage.message.split(" ");
      if (message[0] === "/refetchPlayers") {
        onGoingGame.refetch();
      }
    }
  }, [newNotif()?.data]);

  return (
    <div className="p-4 flex flex-col mx-auto justify-center w-full h-full">
      {onGoingGame.isSuccess && (
        <>
          {gameChange && (
            <Game
              gameStartedRef={gameStartedRef}
              setGameChange={setGameChange}
              onGoingGame={onGoingGame}
              state={state}
            />
          )}
          {!gameChange && <NoGame state={state} />}
          {/* </Game> */}
        </>
      )}
    </div>
  );
};

export default Four;
