import { User } from "@/lib/types";
import { PreGameProfile } from "./preGameProfile";

const PreGame = ({
  type,
  leftUserTop,
  rightUserTop,
  leftUserBottom,
  rightUserBottom,
}: {
  type: string;
  leftUserTop: User | null | undefined;
  rightUserTop: User | null | undefined;
  leftUserBottom: User | null | undefined;
  rightUserBottom: User | null | undefined;
}) => {
  return (
    <div
      className="w-full h-full relative flex justify-center items-center"
    >
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          backgroundImage: "url('/bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.75,
        }}
      />
      <div className="flex flex-col w-full h-full py-3 md:py-1 gap-2">
        <div className="flex flex-row justify-center w-full h-full items-center">
          <div className="w-12 h-12 md:w-22 md:h-22 md:w-32 md:h-32 rounded-md justify-center items-center flex flex-col mx-auto animate-getBigger animate-biggerSmaller bg-blue-500">
            <PreGameProfile avatar={leftUserTop?.avatar || ""} side="left" />
          </div>
          <div className="flex flex-row w-fit h-full">
            {type !== "four" && (
              <div className="text-2xl md:text-5xl lg:text-7xl text-white font-bold h-fit my-auto">
                VS
              </div>
            )}
            {type === "four" && (
              <div className="text-2xl md:text-5xl lg:text-7xl text-white font-bold h-fit mt-auto">
                VS
              </div>
            )}
          </div>
          <div className="w-12 h-12 md:w-22 md:h-22 md:w-32 md:h-32 rounded-md justify-center items-center flex flex-col mx-auto animate-getBigger animate-biggerSmaller bg-red-500">
            <PreGameProfile avatar={rightUserTop?.avatar || ""} side="right" />
          </div>
        </div>
        {(leftUserBottom || rightUserBottom) && (
          <div className="flex flex-row md:justify-center justify-between w-4/6 mx-auto h-full items-center">
            <div className="w-12 h-12 md:w-22 md:h-22 md:w-32 md:h-32 rounded-md justify-center items-center flex flex-col mx-auto animate-getBigger animate-biggerSmaller ml-auto bg-blue-500">
              <PreGameProfile
                avatar={leftUserBottom?.avatar || ""}
                side="left"
              />
            </div>
            <div className="w-12 h-12 md:w-22 md:h-22 md:w-32 md:h-32 rounded-md justify-center items-center flex flex-col mx-auto animate-getBigger animate-biggerSmaller mr-auto bg-red-500">
              <PreGameProfile
                avatar={rightUserBottom?.avatar || ""}
                side="right"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreGame;
