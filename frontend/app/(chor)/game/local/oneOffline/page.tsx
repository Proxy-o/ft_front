"use client";
import { useState } from "react";
import OneOffline from "../oneOffline";

export default function Page() {
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