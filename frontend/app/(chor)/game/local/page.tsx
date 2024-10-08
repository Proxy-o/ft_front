"use client";

import { useState } from "react";
import OneOffline from "./oneOffline";
import Welcome from "./welcome";
import LocalTournament from "./localTournament";

export default function Page() {
  const [type, setType] = useState<"game" | "tournament" | "welcome">(
    "welcome"
  );
  const [gameStarted, setGameStarted] = useState(false);
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);
  return (
    <div className="flex flex-col items-center w-full h-full gap-4 mb-2">
      <h1 className="text-3xl md:text-7xl mt-5">Ping Pong</h1>
      <div className="text-base font-light mb-5 text-center">
        Play a game of ping pong with the same keyboard!
      </div>
      {type === "welcome" && <Welcome setType={setType} />}
      {type === "game" && (
        <OneOffline
          gameStarted={gameStarted}
          setGameStarted={setGameStarted}
          leftScore={leftScore}
          rightScore={rightScore}
          setLeftScore={setLeftScore}
          setRightScore={setRightScore}
          type="game"
        />
      )}
      {type === "tournament" && <LocalTournament />}
    </div>
  );
}
