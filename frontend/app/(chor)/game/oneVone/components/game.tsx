"use client";

import { useEffect, useRef, useState } from "react";
import useGetUser from "../../../profile/hooks/useGetUser";
import { Card } from "@/components/ui/card";
import NoGame from "../../components/noGame";
import PreGame from "../../components/preGame";
import Actions from "./actions";
import Score from "./score";
import Canvas from "./canvas";
import { User } from "@/lib/types";
import useInvitationSocket from "../../hooks/sockets/useInvitationSocket";

const Game = ({
  type,
  onGoingGame,
}: {
  type: string;
  onGoingGame: any;
}) => {
  const leftScoreRef = useRef<number>(0);
  const rightScoreRef = useRef<number>(0);

  const leftUser = useRef<User | undefined>(undefined);
  const rightUser = useRef<User | undefined>(undefined);
  const controllerUser = useRef<User | undefined>(undefined);
  const gameIdRef = useRef<string>("");
  const userRef = useRef<User | undefined>(undefined);
  const state = useRef<string>("none");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const { newNotif } = useInvitationSocket();

  const { data: user } = useGetUser("0");

  userRef.current = user;

  const username = user?.username || "";

  if (
    gameStarted &&
    (onGoingGame?.data?.game?.user1?.username === undefined ||
      onGoingGame?.data?.game?.user2?.username === undefined)
  ) {
    setGameStarted(false);
  }

  if (onGoingGame?.data?.game?.user1?.username === username) {
    leftUser.current = onGoingGame?.data?.game?.user1;
    rightUser.current = onGoingGame?.data?.game?.user2;
    leftScoreRef.current = onGoingGame?.data?.game?.user1_score;
    rightScoreRef.current = onGoingGame?.data?.game?.user2_score;
  } else {
    leftUser.current = onGoingGame?.data?.game?.user2;
    rightUser.current = onGoingGame?.data?.game?.user1;
    leftScoreRef.current = onGoingGame?.data?.game?.user2_score;
    rightScoreRef.current = onGoingGame?.data?.game?.user1_score;
  }

  controllerUser.current = onGoingGame?.data?.game?.user1;

  gameIdRef.current = onGoingGame?.data?.game?.id || "";

  useEffect(() => {
    const notif = newNotif();
    if (notif) {
      const parsedMessage = JSON.parse(notif.data);
      const message = parsedMessage?.message.split(" ");
      if (
        message[0] === "/start" ||
        message[0] === "/refetchPlayers"
      ) {
        onGoingGame.refetch();
      } else if (message[0] === "/leaveGame") {
        if (message[1] !== username) {
          state.current = "leave";
        } else {
          state.current = "none";
        }
        onGoingGame.refetch();
      }
    }
  }, [newNotif()?.data]);

  return (
    <div className="w-full h-fit flex flex-col  justify-center items-center gap-2">
      {gameStarted && (
        <Score
          leftScore={leftScoreRef.current}
          rightScore={rightScoreRef.current}
          leftUserRef={leftUser}
          rightUserRef={rightUser}
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
        {leftUser.current?.username && rightUser.current?.username && (
          <Canvas
          leftUser={leftUser}
          rightUser={rightUser}
          controllerUser={controllerUser}
          state={state}
          gameIdRef={gameIdRef}
          gameStarted={gameStarted}
          setGameStarted={setGameStarted}
          leftScoreRef={leftScoreRef}
          rightScoreRef={rightScoreRef}
          onGoingGame={onGoingGame}
          user={user}
          username={username}
          canvasRef={canvasRef}
          />
        )}

        {!gameStarted &&
          leftScoreRef.current === 0 &&
          rightScoreRef.current === 0 && (
            <PreGame
              type={type}
              leftUserTop={leftUser.current}
              rightUserTop={rightUser.current}
              leftUserBottom={null}
              rightUserBottom={null}
            />
          )}

        {(!gameStarted ||
          leftScoreRef.current === 3 ||
          rightScoreRef.current === 3) && <NoGame state={state} />}
        {leftUser.current?.username &&
          rightUser.current?.username &&
          leftScoreRef.current < 3 &&
          rightScoreRef.current < 3 && (
            <Actions
              gameStarted={gameStarted}
              type={type}
              rightUserRef={rightUser}
              leftUserRef={leftUser}
              gameIdRef={gameIdRef}
            />
          )}
      </Card>
    </div>
  );
};

export default Game;
