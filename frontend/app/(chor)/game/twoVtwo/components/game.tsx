"use client";

import { useEffect, useRef, useState } from "react";
import { User } from "@/lib/types";
import useGetUser from "../../../profile/hooks/useGetUser";
import NoGameFour from "../../components/noGameFour";
import PreGame from "../../components/preGame";
import useGetFourGame from "../../hooks/useGetFourGame";
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
  const state = useRef<string>("none");

  let gameId = "";

  const { onGoingGame } = useGetFourGame(user_id || "0");
  const dummyPlayer: User = {
    username: "player",
    avatar: "none",
    id: "",
  };

  if (onGoingGame.data?.game?.user1?.username === undefined && gameStarted) {
    setGameStarted(false);
  }

  const leftScoreRef = useRef<number>(0);
  const rightScoreRef = useRef<number>(0);

  const leftUserTop = useRef<User>(dummyPlayer);
  const leftUserBottom = useRef<User>(dummyPlayer);
  const rightUserTop = useRef<User>(dummyPlayer);
  const rightUserBottom = useRef<User>(dummyPlayer);

  const username: string = user?.username || "";

  const { newNotif, handleRefetchPlayers } = useInvitationSocket();

  leftScoreRef.current = onGoingGame.data?.game?.user1_score || 0;
  rightScoreRef.current = onGoingGame.data?.game?.user2_score || 0;

  leftUserTop.current = onGoingGame.data?.game?.user1 || dummyPlayer;
  leftUserBottom.current = onGoingGame.data?.game?.user3 || dummyPlayer;
  rightUserTop.current = onGoingGame.data?.game?.user2 || dummyPlayer;
  rightUserBottom.current = onGoingGame.data?.game?.user4 || dummyPlayer;
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
    <>
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
      <Card className="flex flex-col mx-auto justify-center w-full aspect-[2] relative">
        {onGoingGame.isSuccess && (
          <>
            {!gameStarted &&
              (onGoingGame.data?.game &&
              onGoingGame.data?.game?.user1_score < 3.0000 &&
              onGoingGame.data?.game?.user2_score < 3.0000 ? (
                  <PreGame
                    type="four"
                    leftUserTop={leftUserTop.current}
                    leftUserBottom={leftUserBottom.current}
                    rightUserTop={rightUserTop.current}
                    rightUserBottom={rightUserBottom.current}
                  />
              ) : (
                <>
                  <NoGameFour state={state} />
                </>
              ))}
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
              playerReadyRef={playerReadyRef}
            />
          </>
        )}
        {/* {!gameChange && <NoGame state={state} />} */}
        {/* </Game> */}
        {onGoingGame.data?.game &&
          onGoingGame.data?.game?.user1_score < 3.0000 &&
          onGoingGame.data?.game?.user2_score < 3.0000 && (
            <FourActions
              playerReadyRef={playerReadyRef}
              gameStarted={gameStarted}
              username={username}
              leftUserTop={leftUserTop}
              leftUserBottom={leftUserBottom}
              rightUserBottom={rightUserBottom}
              rightUserTop={rightUserTop}
              onGoingGame={onGoingGame}
              handleRefetchPlayers={handleRefetchPlayers}
            />
          )}
      </Card>
    </>
  );
};

export default Game;
