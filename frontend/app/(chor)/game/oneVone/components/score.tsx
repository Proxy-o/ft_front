import { User } from "@/lib/types";
import { ScoreProfile } from "../../components/preGameProfile";

const Score = ({
  leftScoreRef,
  rightScoreRef,
  leftUserRef,
  rightUserRef,
}: {
  leftScoreRef: React.MutableRefObject<number>;
  rightScoreRef: React.MutableRefObject<number>;
  leftUserRef: React.MutableRefObject<User | undefined>;
  rightUserRef: React.MutableRefObject<User | undefined>;
}) => {
  return (
    <div className="w-4/6 md:w-5/6 h-fit flex justify-between items-center rounded-sm ">
      <div className="w-24 h-24 rounded-md justify-center items-center flex flex-row animate-getBigger animate-biggerSmaller gap-4">
        <div className="h-full w-full bg-primary flex justify-center items-center bg-gray-700 rounded-md">
          <ScoreProfile
            avatar={leftUserRef.current?.avatar || "none"}
            side="left"
          />
        </div>
        <span className="text-white text-4xl font-bold">
          {leftScoreRef.current}
        </span>
      </div>
      <div className="w-24 h-24 rounded-md justify-center items-center flex flex-row animate-getBigger animate-biggerSmaller gap-4">
        <span className="text-white text-4xl font-bold">
          {rightScoreRef.current}
        </span>
        <div className="h-full w-full bg-primary flex justify-center items-center bg-gray-700 rounded-md">
          <ScoreProfile
            avatar={rightUserRef.current?.avatar || "none"}
            side="right"
          />
        </div>
      </div>
    </div>
  );
};

export default Score;
