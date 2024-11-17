"use client";
import { useEffect, useState } from "react";
import LocalTournamentBoard from "./localTournamentBoard";
import OneOffline from "../oneOffline";
import AliasDialog from "./aliasDialog";
import { Button } from "@/components/ui/button";

const LocalTournament = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [semi1, setSemi1] = useState({ score1: 0, score2: 0 });
  const [semi2, setSemi2] = useState({ score1: 0, score2: 0 });
  const [final, setFinal] = useState({ score1: 0, score2: 0 });
  const [semi1Winner, setSemi1Winner] = useState(-1);
  const [semi2Winner, setSemi2Winner] = useState(-1);
  const [finalWinner, setFinalWinner] = useState(0);
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);

  const [playerAlias, setPlayerAlias] = useState<string[]>([]);

  const [currentGame, setCurrentGame] = useState("semi1");

  useEffect(() => {
    if (semi2Winner === -1) {
      if (semi2.score1 === 3) {
        setSemi2Winner(3);
      } else if (semi2.score2 === 3) {
        setSemi2Winner(4);
      }
    }
    if (semi1Winner === -1) {
      if (semi1.score1 === 3) {
        setSemi1Winner(1);
      } else if (semi1.score2 === 3) {
        setSemi1Winner(2);
      }
    }
    if (leftScore !== 0 || rightScore !== 0) {
      if (currentGame == "semi1") {
        // console.log("semi1");
        setSemi1({ score1: leftScore, score2: rightScore });
        if (leftScore === 3 || rightScore === 3) {
          setRightScore(0);
          setLeftScore(0);
          setGameStarted(false);
          setCurrentGame("semi2");
        }
      } else if (currentGame === "semi2") {
        setSemi2({ score1: leftScore, score2: rightScore });
        if (leftScore === 3 || rightScore === 3) {
          setRightScore(0);
          setLeftScore(0);
          setGameStarted(false);
          setCurrentGame("final");
        }
      } else if (currentGame === "final") {
        if (gameStarted) {
          setFinal({ score1: leftScore, score2: rightScore });
        } else {
          setFinal({ score1: 0, score2: 0 });
        }
        // if (final.score1 > final.score2) {
        //   setSemi1Winner(1);
        // } else {
        //   setSemi1Winner(2);
        // }
        if (leftScore === 3 || rightScore === 3) {
          if (final.score1 > final.score2) {
            setFinalWinner(semi1Winner);
          } else {
            setFinalWinner(semi2Winner);
          }
          setRightScore(0);
          setLeftScore(0);
          // setGameStarted(false);
          setCurrentGame("semi1");
        }
      }
    }
  }, [leftScore, rightScore, gameStarted]);
  return (
    <>
      {finalWinner === 0 ? (
        <AliasDialog
          setFinalWinner={setFinalWinner}
          setPlayerAlias={setPlayerAlias}
        />
      ) : (
        <>
          <LocalTournamentBoard
            playerAlias={playerAlias}
            score1={semi1.score1}
            score2={semi1.score2}
            score3={semi2.score1}
            score4={semi2.score2}
            finalScore1={final.score1}
            finalScore2={final.score2}
            semi1Winner={semi1Winner}
            semi2Winner={semi2Winner}
            currentGame={currentGame}
            gameStarted={gameStarted}
          />

          {finalWinner === -1 ? (
            <>
              <OneOffline
                gameStarted={gameStarted}
                setGameStarted={setGameStarted}
                leftScore={leftScore}
                rightScore={rightScore}
                setLeftScore={setLeftScore}
                setRightScore={setRightScore}
                type="tournament"
              />
              <Button
                onClick={() => {
                  setFinalWinner(0);
                  setSemi1Winner(-1);
                  setSemi2Winner(-1);
                  setPlayerAlias([]);
                  setRightScore(0);
                  setLeftScore(0);
                  setCurrentGame("semi1");
                  setSemi1({ score1: 0, score2: 0 });
                  setSemi2({ score1: 0, score2: 0 });
                  setFinal({ score1: 0, score2: 0 });
                }}
              >
                End Tournament
              </Button>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center gap-4">
              <div className="bg-yellow-400/20 rounded-sm p-4 text-xl">
                The winnner is
                <p className="text-center text-3xl pt-2">{playerAlias[finalWinner - 1]}</p>
              </div>
              <Button
                onClick={() => {
                  setFinalWinner(0);
                  setSemi1Winner(-1);
                  setSemi2Winner(-1);
                  setPlayerAlias([]);
                  setRightScore(0);
                  setLeftScore(0);
                  setCurrentGame("semi1");
                  setSemi1({ score1: 0, score2: 0 });
                  setSemi2({ score1: 0, score2: 0 });
                  setFinal({ score1: 0, score2: 0 });
                }}
              >
                New Tournament
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default LocalTournament;
