"use client";

import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import useSurrenderGame from "../hooks/useSurrender";
import useGameSocket from "@/lib/hooks/useGameSocket"; // Make sure this is the correct path
import getCookie from "@/lib/functions/getCookie";
import { toast } from "sonner";
import useGetUser from "@/app/profile/hooks/useGetUser";
import CountDown from "../components/contDown";
import { User } from "@/lib/types";
import useGetGame from "../hooks/useGetGames";
import Score from "../components/score";
import { changeScoreOnline } from "../methods/changeScore";
import enemyLeftGame from "../methods/enemyLeftGame";
import { movePaddlesOnline } from "../methods/movePaddles";
import { checkLoseConditionOnline } from "../methods/checkLoseCondition";
import { changeBallDirectionOnline } from "../methods/changeBallDirection";
import { draw } from "../methods/draw";
import checkCollisionWithHorizontalWalls from "../methods/checkCollisionWithHorizontalWalls";
import { moveBall } from "../methods/moveBall";
import { canvasParams } from "../types";
import useEndGame from "../hooks/useEndGame";
import useLeaveGame from "../hooks/useLeaveGame";
import Game from "./game";

const Two = ({ type }: { type: string }) => {
  const user_id = getCookie("user_id") || "";
  const { data: user } = useGetUser(user_id || "0");
  const username = user?.username || "";
  const PaddleRightYRef = useRef(0);
  const paddleLeftYRef = useRef(0);
  const newBallPositionRef = useRef({ x: 0, y: 0 }); // Use a ref to store the current state
  const newAngleRef = useRef(0); // Use a ref to store the current state
  const { mutate: surrenderGame } = useSurrenderGame();
  const { mutate: leaveGame } = useLeaveGame();
  const isFirstTime = useRef(true);
  const isEnemyReadyRef = useRef(false);
  const [leftScore, setLeftScore] = useState(0);
  const leftScoreRef = useRef(0);
  const [rightScore, setRightScore] = useState(0);
  const rightScoreRef = useRef(0);
  //game logic
  const { onGoingGame } = useGetGame(user_id || "0", type);

  const { handleSurrender } = useGameSocket();

  const rightUser: User | undefined =
    onGoingGame?.data?.game?.user1?.username === username
      ? onGoingGame?.data?.game?.user2
      : onGoingGame?.data?.game?.user1;
  const leftUser: User | undefined =
    onGoingGame?.data?.game?.user1?.username === username
      ? onGoingGame?.data?.game?.user1
      : onGoingGame?.data?.game?.user2;

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
