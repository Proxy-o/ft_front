import { User } from "@/lib/types";
import { ScoreProfile } from "../../components/preGameProfile";

const Score = ({
  leftScoreRef,
  rightScoreRef,
  leftUserTop,
  rightUserTop,
  leftUserBottom,
  rightUserBottom,
}: {
  leftScoreRef: React.MutableRefObject<number>;
  rightScoreRef: React.MutableRefObject<number>;
  leftUserTop: React.MutableRefObject<User>;
  rightUserTop: React.MutableRefObject<User>;
  leftUserBottom: React.MutableRefObject<User>;
  rightUserBottom: React.MutableRefObject<User>;
}) => {
  return (
    <div className="w-4/6 md:w-5/6 h-fit flex justify-between items-center rounded-sm ">
      <div className="w-24 h-24 rounded-md justify-center items-center flex flex-row animate-getBigger animate-biggerSmaller gap-4">
        <div className="flex flex-col scale-50 gap-4">
          <div className="h-full w-full bg-primary flex justify-center items-center bg-gray-700 rounded-md">
            <ScoreProfile
              avatar={leftUserTop.current?.avatar || "none"}
              side="left"
            />
          </div>
          <div className="h-full w-full bg-primary flex justify-center items-center bg-gray-700 rounded-md">
            <ScoreProfile
              avatar={leftUserBottom.current?.avatar || "none"}
              side="left"
            />
          </div>
        </div>
        <span className="text-white text-4xl font-bold">
          {leftScoreRef.current}
        </span>
      </div>
      <div className="w-24 h-24 rounded-md justify-center items-center flex flex-row animate-getBigger animate-biggerSmaller gap-4">
        <span className="text-white text-4xl font-bold">
          {rightScoreRef.current}
        </span>
        <div className="flex flex-col scale-50 gap-4">
          <div className="h-full w-full bg-primary flex justify-center items-center bg-gray-700 rounded-md">
            <ScoreProfile
              avatar={rightUserTop.current?.avatar || "none"}
              side="right"
            />
          </div>
          <div className="h-full w-full bg-primary flex justify-center items-center bg-gray-700 rounded-md">
            <ScoreProfile
              avatar={rightUserBottom.current?.avatar || "none"}
              side="right"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Score;
