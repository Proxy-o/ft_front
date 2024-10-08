import { useEffect, useState } from "react";
import LocalTournamentBoard from "./localTournamentBoard";
import OneOffline from "./oneOffline";
import Score from "../oneVone/components/score";

const LocalTournament = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [semi1, setSemi1] = useState({ score1: 0, score2: 0 });
  const [semi2, setSemi2] = useState({ score1: 0, score2: 0 });
  const [final, setFinal] = useState({ score1: 0, score2: 0 });
  const [semi1Winner, setSemi1Winner] = useState(-1);
  const [semi2Winner, setSemi2Winner] = useState(-1);
  const [finalWinner, setFinalWinner] = useState(-1);
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);

  console.log(semi1, semi2, final);
  const [currentGame, setCurrentGame] = useState("semi1");
  useEffect(() => {
    if (leftScore !== 0 || rightScore !== 0) {
      if (currentGame == "semi1") {
        console.log("semi1");
        setSemi1({ score1: leftScore, score2: rightScore });
        if (semi1.score1 > semi1.score2) {
          setSemi1Winner(1);
        } else {
          setSemi1Winner(2);
        }
        if (leftScore === 3 || rightScore === 3) {
          setRightScore(0);
          setLeftScore(0);
          setCurrentGame("semi2");
        }
      } else if (currentGame === "semi2") {
        setSemi2({ score1: leftScore, score2: rightScore });
        if (semi2.score1 > semi2.score2) {
          setSemi2Winner(3);
        } else {
          setSemi2Winner(4);
        }
        if (leftScore === 3 || rightScore === 3) {
          setRightScore(0);
          setLeftScore(0);
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
          setCurrentGame("semi1");
        }
      }
    }
  }, [leftScore, rightScore, gameStarted]);
  return (
    <>
      {gameStarted && <Score leftScore={leftScore} rightScore={rightScore} />}
      {!gameStarted && (
        <LocalTournamentBoard
          score1={semi1.score1}
          score2={semi1.score2}
          score3={semi2.score1}
          score4={semi2.score2}
          finalScore1={final.score1}
          finalScore2={final.score2}
          semi1Winner={semi1Winner}
          semi2Winner={semi2Winner}
          currentGame={currentGame}
        />
      )}
      {finalWinner === -1 ? (
        <OneOffline
          gameStarted={gameStarted}
          setGameStarted={setGameStarted}
          leftScore={leftScore}
          rightScore={rightScore}
          setLeftScore={setLeftScore}
          setRightScore={setRightScore}
          type="tournament"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center gap-4">
          <button
            onClick={() => {
              setFinalWinner(-1);
              setSemi1Winner(-1);
              setSemi2Winner(-1);
              setRightScore(0);
              setLeftScore(0);
              setCurrentGame("semi1");
              setSemi1({ score1: 0, score2: 0 });
              setSemi2({ score1: 0, score2: 0 });
              setFinal({ score1: 0, score2: 0 });
            }}
            className="bg-primary text-white p-2 rounded-md"
          >
            New Tournament
          </button>
        </div>
      )}
    </>
  );
};

export default LocalTournament;
