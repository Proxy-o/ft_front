"use client";

import React, { use, useEffect, useRef, useState } from "react";

import getCookie from "@/lib/functions/getCookie";

import useGetFourGame from "../hooks/useGetFourGame";
import Game from "./game";
import useInvitationSocket from "@/lib/hooks/useInvitationSocket";
import { toast } from "sonner";
import NoGame from "../components/noGame";

const Four = () => {
  const user_id = getCookie("user_id") || "";
  const gameStartedRef = useRef(false);
  const uslessState = useRef<string>("none");

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
    toast.success("heloooooo");
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
        toast.success("Players refetched");
        onGoingGame.refetch();
      }
    }
  }, [newNotif()?.data]);

  return (
    <div className="p-4 flex flex-col mx-auto justify-center w-full h-full">
      <h1 className="text-4xl mx-auto">Four Player Game</h1>

      {onGoingGame.isSuccess && (
        <>
          {/* {onGoingGame.data.game.user1 && <Score type="four" />} */}
          {gameChange && (
            <Game
              gameStartedRef={gameStartedRef}
              setGameChange={setGameChange}
              onGoingGame={onGoingGame}
            />
          )}
          {!gameChange && <NoGame state={uslessState} />}
          {/* </Game> */}
        </>
      )}
    </div>
  );
};

export default Four;
