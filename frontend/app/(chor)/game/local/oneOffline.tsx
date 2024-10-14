"use client";

import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import NoGame from "../components/noGame";
import Score from "../oneVone/components/score";
import Canvas from "./canvas";

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
      <Card className="w-full aspect-[2]">
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
      </Card>
      {gameStarted ? (
        type === "game" && (
        <Button
          onClick={() => {
            setLeftScore(0);
            setRightScore(0);
            setGameStarted(false);
          }}
          className="w-1/3 mx-auto bg-red-500/25"
        >
          End Game
        </Button>
        )
      ) : (
        <Button
          onClick={() => {
            setGameStarted(true);
          }}
          className="w-1/3 mx-auto h-10 p-3 bg-green-500/25"
        >
          Start Game
        </Button>
      )}
    </>
  );
};

export default OneOffline;
