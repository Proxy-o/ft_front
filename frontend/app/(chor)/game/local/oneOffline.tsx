"use client";

import React, { useRef } from "react";
import { Card } from "@/components/ui/card";
import NoGame from "../components/noGame";
import Score from "../oneVone/components/score";
import Canvas from "./canvas";
import Actions from "./actions";

const OneOffline = ({
  gameStarted,
  setGameStarted,
  leftScore,
  rightScore,
  setLeftScore,
  setRightScore,
  type,
}: {
  gameStarted: boolean;
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
  leftScore: number;
  rightScore: number;
  setLeftScore: React.Dispatch<React.SetStateAction<number>>;
  setRightScore: React.Dispatch<React.SetStateAction<number>>;
  type: "game" | "tournament";
}) => {
  const state = useRef<string>("local");

  return (
    <>
      {gameStarted && type === "game" && (
        <Score leftScore={leftScore} rightScore={rightScore} />
      )}
      <Card className="w-full relative aspect-[2]">
        {gameStarted ? (
          <Canvas
            gameStarted={gameStarted}
            setGameStarted={setGameStarted}
            leftScore={leftScore}
            rightScore={rightScore}
            setLeftScore={setLeftScore}
            setRightScore={setRightScore}
            state={state}
          />
        ) : (
          <div className="flex flex-col items-center w-full h-full">
            <NoGame state={state} />
          </div>
        )}
        <Actions
          gameStarted={gameStarted}
          setGameStarted={setGameStarted}
          type={type}
          setLeftScore={setLeftScore}
          setRightScore={setRightScore}
        />
      </Card>
    </>
  );
};

export default OneOffline;
