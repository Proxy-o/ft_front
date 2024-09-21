"use client";

import { useEffect, useRef, useState } from "react";
import useGameSocket from "@/app/(chor)/game/hooks/sockets/useGameSocket";
import { User } from "@/lib/types";
import getCookie from "@/lib/functions/getCookie";
import useGetUser from "../../../profile/hooks/useGetUser";
import NoGameFour from "../../components/noGameFour";
import useSurrenderGame from "../../hooks/useSurrender";
import PreGame from "../../components/preGame";
import useGetFourGame from "../../hooks/useGetFourGame";
import Canvas from "./canvas";
import useInvitationSocket from "../../hooks/sockets/useInvitationSocket";
import FourActions from "./fourActions";

const Game = () => {
  const playerReadyRef = useRef(0);

  const user_id = getCookie("user_id") || "";
  const [gameStarted, setGameStarted] = useState(false);
  const state = useRef<string>("none");

  let gameId = "";

  const { onGoingGame } = useGetFourGame(user_id || "0");
  const dummyPlayer: User = {
    username: "player",
    avatar: "none",
    id: "",
  };

  const leftUserTop = useRef<User>(dummyPlayer);
  const leftUserBottom = useRef<User>(dummyPlayer);
  const rightUserTop = useRef<User>(dummyPlayer);
  const rightUserBottom = useRef<User>(dummyPlayer);

  const { data: user } = useGetUser(user_id || "0");
  const username: string = user?.username || "";

  const { newNotif, handleRefetchPlayers } = useInvitationSocket();

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
    <div className="p-4 flex flex-col mx-auto justify-center w-full h-full">
      {onGoingGame.isSuccess && (
        <>
          {!gameStarted &&
            (onGoingGame.data?.game &&
            onGoingGame.data?.game?.user1_score < 3 &&
            onGoingGame.data?.game?.user2_score < 3 ? (
              <div
                className={"w-full h-full flex justify-center items-center"}
                style={{
                  backgroundImage: "url('/game.jpeg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <PreGame
                  type="four"
                  leftUserTop={leftUserTop.current}
                  leftUserBottom={leftUserBottom.current}
                  rightUserTop={rightUserTop.current}
                  rightUserBottom={rightUserBottom.current}
                />
              </div>
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
                handleRefetchPlayers={handleRefetchPlayers}
              />
            )}
        </>
      )}
      {/* {!gameChange && <NoGame state={state} />} */}
      {/* </Game> */}
    </div>
  );
};

export default Game;
