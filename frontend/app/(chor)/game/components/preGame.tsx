import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/types";
import { Avatar } from "@radix-ui/react-avatar";
import PreGameProfile from "./preGameProfile";

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
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-row lg:justify-center justify-between w-full h-full items-center">
        <div className="w-24 h-24 lg:w-44 lg:h-44 rounded-md justify-center items-center flex flex-col animate-getBigger animate-biggerSmaller ml-auto bg-blue-500">
          <PreGameProfile avatar={leftUserTop?.avatar || ""} side="left" />
        </div>
        <div className="flex flex-row w-fit h-full m-auto">
          {type !== "four" && (
            <div className="text-5xl lg:text-7xl text-white font-bold h-fit my-auto">
              VS
            </div>
          )}
          {type === "four" && (
            <div className="text-5xl lg:text-7xl text-white font-bold h-fit mt-auto">
              VS
            </div>
          )}
        </div>
        <div className="w-24 h-24 lg:w-44 lg:h-44 rounded-md justify-center items-center flex flex-col animate-getBigger animate-biggerSmaller mr-auto bg-red-500">
          <PreGameProfile avatar={rightUserTop?.avatar || ""} side="right" />
        </div>
      </div>
      {(leftUserBottom || rightUserBottom) && (
        <div className="flex flex-row lg:justify-center justify-between w-full h-full items-center gap-20 lg:gap-36">
          <div className="w-24 h-24 lg:w-44 lg:h-44 rounded-md justify-center items-center flex flex-col animate-getBigger animate-biggerSmaller ml-auto bg-blue-500">
            <PreGameProfile avatar={leftUserBottom?.avatar || ""} side="left" />
          </div>
          <div className="w-24 h-24 lg:w-44 lg:h-44 rounded-md justify-center items-center flex flex-col animate-getBigger animate-biggerSmaller mr-auto bg-red-500">
            <PreGameProfile avatar={rightUserBottom?.avatar || ""} side="right" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PreGame;
