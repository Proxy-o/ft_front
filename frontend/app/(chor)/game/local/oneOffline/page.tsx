"use client";
import { useState } from "react";
import LocalTournament from "../localTournament";
import OneOffline from "../oneOffline";

export default function Page() {
  const [type, setType] = useState<"game" | "tournament" | "welcome">(
    "welcome"
  );
  const [gameStarted, setGameStarted] = useState(false);
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);
  return (
    <OneOffline
      gameStarted={gameStarted}
      setGameStarted={setGameStarted}
      leftScore={leftScore}
      rightScore={rightScore}
      setLeftScore={setLeftScore}
      setRightScore={setRightScore}
      type="game"
    />
  );
}
