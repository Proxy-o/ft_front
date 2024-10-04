import { User } from "@/lib/types";
import { ScoreProfile } from "../../components/preGameProfile";

const Score = ({
  leftScore,
  rightScore,
  leftUserRef,
  rightUserRef,
}: {
  leftScore: number;
  rightScore: number;
  leftUserRef?: React.MutableRefObject<User | undefined>;
  rightUserRef?: React.MutableRefObject<User | undefined>;
}) => {
  return (
    <div className="w-4/6 md:w-5/6 h-fit flex justify-between items-center rounded-sm ">
      <div className="w-24 h-24 rounded-md justify-center items-center flex flex-row animate-getBigger animate-biggerSmaller gap-4">
        <div className="h-full w-full bg-primary flex justify-center items-center bg-gray-700 rounded-md">
          <ScoreProfile
            avatar={leftUserRef?.current?.avatar || "local"}
            side="left"
          />
        </div>
        <span className="text-white text-4xl font-bold">{leftScore}</span>
      </div>
      <div className="w-24 h-24 rounded-md justify-center items-center flex flex-row animate-getBigger animate-biggerSmaller gap-4">
        <span className="text-white text-4xl font-bold">{rightScore}</span>
        <div className="h-full w-full bg-primary flex justify-center items-center bg-gray-700 rounded-md">
          <ScoreProfile
            avatar={rightUserRef?.current?.avatar || "local"}
            side="right"
          />
        </div>
      </div>
    </div>
  );
};

export default Score;
