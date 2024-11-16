"use client";

import { useEffect, useRef, useState } from "react";
import { User } from "@/lib/types";
import useGetUser from "../../../profile/hooks/useGetUser";
import NoGameFour from "../../components/noGameFour";
import PreGame from "../../components/preGame";
import useGetFourGame from "../../hooks/game/useGetFourGame";
import Canvas from "./canvas";
import useInvitationSocket from "../../hooks/sockets/useInvitationSocket";
import FourActions from "./fourActions";
import { Card } from "@/components/ui/card";
import Score from "./score";

const Game = () => {
  const playerReadyRef = useRef(0);
  const { data: user } = useGetUser("0");
  const user_id = user?.id;
  const [gameStarted, setGameStarted] = useState(false);
  const [state, setState] = useState("none");
  const dummyPlayer: User = {
    username: "player",
    avatar: "none",
    id: "",
  };

  const leftScoreRef = useRef<number>(0);
  const rightScoreRef = useRef<number>(0);

  const leftUserTop = useRef<User>(dummyPlayer);
  const leftUserBottom = useRef<User>(dummyPlayer);
  const rightUserTop = useRef<User>(dummyPlayer);
  const rightUserBottom = useRef<User>(dummyPlayer);

  let gameId = "";

  const { onGoingGame } = useGetFourGame(user_id || "0");

  if (onGoingGame.data?.game?.user1?.username === undefined && gameStarted) {
    setGameStarted(false);
  }

  leftUserTop.current = onGoingGame.data?.game?.user1 || dummyPlayer;
  rightUserTop.current = onGoingGame.data?.game?.user2 || dummyPlayer;
  leftUserBottom.current = onGoingGame.data?.game?.user3 || dummyPlayer;
  rightUserBottom.current = onGoingGame.data?.game?.user4 || dummyPlayer;

  const username: string = user?.username || "";

  const { newNotif, handleRefetchPlayers } = useInvitationSocket();

  leftScoreRef.current = onGoingGame.data?.game?.user1_score || 0;
  rightScoreRef.current = onGoingGame.data?.game?.user2_score || 0;

  gameId = onGoingGame.data?.game.id || "";

  useEffect(() => {
    if (newNotif()) {
      const notif = newNotif();
      const parsedMessage = JSON.parse(notif?.data);
      // console.log(parsedMessage);
      const message = parsedMessage.message.split(" ");
      if (message[0] === "/start") {
        // invitaionsData.refetch();
        handleRefetchPlayers(onGoingGame.data?.game.id || "");
        onGoingGame.refetch();
        // setStartCountdown(true);
      } else if (message[0] === "/refetchPlayers") {
        onGoingGame.refetch();
      }
    }
  }, [newNotif()?.data]);

  return (
    <div className="w-full h-fit flex flex-col justify-center items-center gap-2">
      {gameStarted && (
        <Score
          leftScoreRef={leftScoreRef}
          rightScoreRef={rightScoreRef}
          leftUserTop={leftUserTop}
          leftUserBottom={leftUserBottom}
          rightUserTop={rightUserTop}
          rightUserBottom={rightUserBottom}
        />
      )}
      <Card
        className="relative w-full aspect-[2] overflow-hidden z-20"
        style={{
          backgroundImage: "url('/fullbg3.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
        }}
      >
        {!gameStarted &&
          (onGoingGame.data?.game?.user1 ||
            onGoingGame.data?.game?.user2 ||
            onGoingGame.data?.game?.user3 ||
            onGoingGame.data?.game?.user4) &&
          leftScoreRef.current === 0 &&
          rightScoreRef.current === 0 && (
            <PreGame
              type="four"
              leftUserTop={leftUserTop.current}
              leftUserBottom={leftUserBottom.current}
              rightUserTop={rightUserTop.current}
              rightUserBottom={rightUserBottom.current}
            />
          )}

          <NoGameFour state={state} gameStarted={gameStarted} />
        

        <Canvas
          leftUserTop={leftUserTop}
          leftUserBottom={leftUserBottom}
          rightUserTop={rightUserTop}
          rightUserBottom={rightUserBottom}
          gameId={gameId}
          gameStarted={gameStarted}
          setGameStarted={setGameStarted}
          onGoingGame={onGoingGame}
          username={username}
          state={state}
          setState={setState}
          playerReadyRef={playerReadyRef}
        />
        {onGoingGame.data?.game &&
          onGoingGame.data?.game?.user1_score < 3 &&
          onGoingGame.data?.game?.user2_score < 3 && (
            <FourActions
              playerReadyRef={playerReadyRef}
              gameStarted={gameStarted}
              username={username}
              leftUserTop={leftUserTop}
              leftUserBottom={leftUserBottom}
              rightUserBottom={rightUserBottom}
              rightUserTop={rightUserTop}
              onGoingGame={onGoingGame}
              status={state}
              setState={setState}
              handleRefetchPlayers={handleRefetchPlayers}
            />
          )}
      </Card>
    </div>
  );
};

export default Game;
