import { ScoreProfile } from "../components/preGameProfile";

const LocalTournamentBoard = ({
  score1,
  score2,
  score3,
  score4,
  finalScore1,
  finalScore2,
  semi1Winner,
  semi2Winner,
  currentGame,
  gameStarted,
}: {
  score1: number;
  score2: number;
  score3: number;
  score4: number;
  finalScore1: number;
  finalScore2: number;
  semi1Winner: number;
  semi2Winner: number;
  currentGame: string;
  gameStarted: boolean;
}) => {
  return (
    // <div className="w-full h-full flex flex-col items-center gap-4">
    <>
      {semi1Winner !== -1 && semi2Winner !== -1 && (
        <div className="w-full h-fit py-2 flex flex-row items-center gap-4 bg-yellow-400/20 rounded-lg">
          <div className="w-full h-24 rounded-md justify-center items-center flex flex-row animate-getBigger animate-biggerSmaller gap-4">
            <div className="h-full w-fit bg-primary flex justify-center items-center bg-gray-700 rounded-md">
              <ScoreProfile avatar="local" side="left" number={semi1Winner} />
            </div>
            <span className="text-white text-4xl font-bold">{finalScore1}</span>
          </div>
          <div className="w-full h-5/6 top-2 left-1/3 flex flex-col justify-between items-center">
            {/* {currentGame === "final" && "Next Game"} */}
            <div>final</div>
          </div>
          <div className="w-full h-24 rounded-md justify-center items-center flex flex-row animate-getBigger animate-biggerSmaller gap-4">
            <span className="text-white text-4xl font-bold">{finalScore2}</span>
            <div className="h-full w-fit bg-primary flex justify-center items-center bg-gray-700 rounded-md">
              <ScoreProfile avatar="local" side="right" number={semi2Winner} />
            </div>
          </div>
        </div>
      )}
      {(semi1Winner === -1 || semi2Winner === -1) && (
        <div className="text-xs sm:text-base w-full h-fit  flex flex-col md:flex-row justify-between items-center gap-4 overflow-auto sm:overflow-visible">
          {(!gameStarted || (gameStarted && currentGame === "semi1")) && (
            <div
              className={`w-full h-full p-2 flex justify-between  items-center rounded-sm
            ${currentGame === "semi1" ? "bg-yellow-400/20" : ""}`}
            >
              <div className="w-fit h-24 rounded-md justify-center items-center flex flex-row animate-getBigger animate-biggerSmaller gap-4 ">
                <div className="h-full w-fit bg-primary flex justify-center items-center bg-gray-700 rounded-md">
                  <ScoreProfile avatar="local" side="left" number={1} />
                </div>
                <span className="text-white text-4xl font-bold">{score1}</span>
              </div>
              <div className="w-full h-5/6 top-2 left-1/3 flex flex-col justify-between items-center ">
                <div>semi1</div>
              </div>
              <div className="w-fit h-24  scale-50 sm:scale-100 rounded-md justify-center items-center flex flex-row animate-getBigger animate-biggerSmaller gap-4">
                <span className="text-white text-4xl font-bold">{score2}</span>
                <div className="h-full w-fit bg-primary flex justify-center items-center bg-gray-700 rounded-md">
                  <ScoreProfile avatar="local" side="right" number={2} />
                </div>
              </div>
            </div>
          )}
          {(!gameStarted || (gameStarted && currentGame === "semi2")) && (
            <div
              className={`w-full h-full p-2 flex justify-between  items-center rounded-sm
            ${currentGame === "semi2" ? "bg-yellow-400/20" : ""}`}
            >
              <div className="w-fit h-24 rounded-md justify-center items-center flex flex-row animate-getBigger animate-biggerSmaller gap-4">
                <div className="h-full w-full bg-primary flex justify-center items-center bg-gray-700 rounded-md">
                  <ScoreProfile avatar="local" side="left" number={3} />
                </div>
                <span className="text-white text-4xl font-bold">{score3}</span>
              </div>
              <div className="w-full h-5/6 top-2 left-1/3 flex flex-col justify-between items-center">
                <div>semi2</div>
              </div>
              <div className="w-fit h-24 rounded-md justify-center items-center flex flex-row animate-getBigger animate-biggerSmaller gap-4">
                <span className="text-white text-4xl font-bold">{score4}</span>
                <div className="h-full w-full bg-primary flex justify-center items-center bg-gray-700 rounded-md">
                  <ScoreProfile avatar="local" side="right" number={4} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
    // </div>
  );
};

export default LocalTournamentBoard;
