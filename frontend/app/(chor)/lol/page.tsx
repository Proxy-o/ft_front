"use client"

import { useEffect } from "react";
import useGameSocket from "../game/hooks/useGameSocket";
export default function Page() {
    const { gameMsg, handleEnemyScore } = useGameSocket();

    useEffect(() => {
        console.log(gameMsg()?.data);
    }
    , [gameMsg()?.data]);

    console.log("rendering page");
    
  return (
    <div>
        <div
        onClick={() => {
          console.log("clicked");
            handleEnemyScore("");
        }
        }
        >click me</div>
    </div>
  );
}