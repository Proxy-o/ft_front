import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/types";
import { Avatar } from "@radix-ui/react-avatar";

const PreGame = ({
  leftUserTop,
  rightUserTop,
  leftUserBottom,
  rightUserBottom,
}: {
  leftUserTop: User | null | undefined;
  rightUserTop: User | null | undefined;
  leftUserBottom: User | null | undefined;
  rightUserBottom: User | null | undefined;
}) => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-row lg:justify-center justify-between w-full h-full items-center">
        <div className="w-24 h-24 lg:w-44 lg:h-44 rounded-md bg-gradient-to-br from-primary to-secondary justify-center items-center flex flex-col animate-getBigger animate-biggerSmaller ml-auto">
          <div className="w-24 h-24 lg:w-44 lg:h-44 rounded-md justify-center items-center flex flex-col sckeliton ">
            <Avatar>
              <AvatarImage
                src={leftUserTop?.avatar}
                alt="profile image"
                className="w-20 h-20 lg:w-40 lg:h-40 rounded-md bg-primary/35"
              />
              <AvatarFallback className="rounded-sm w-20 h-20 lg:w-40 lg:h-40 text-3xl lg:text-9xl font-bold">
                ?
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="w-10 h-10 flex items-center justify-center m-auto">
          <h1 className="text-5xl lg:text-7xl text-white font-bold">VS</h1>
        </div>
        <div className="w-24 h-24 lg:w-44 lg:h-44 rounded-md bg-gradient-to-br from-primary to-secondary justify-center items-center flex flex-col animate-getBigger animate-biggerSmaller mr-auto">
          <div className="w-24 h-24 lg:w-44 lg:h-44 rounded-md justify-center items-center flex flex-col sckeliton ">
            <Avatar>
              <AvatarImage
                src={rightUserTop?.avatar}
                alt="profile image"
                className="w-20 h-20 lg:w-40 lg:h-40 rounded-md bg-primary/35"
              />
              <AvatarFallback className="rounded-sm w-20 h-20 lg:w-40 lg:h-40 text-3xl lg:text-9xl font-bold">
                ?
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
      {(leftUserBottom || rightUserBottom) && (
        <div className="flex flex-row lg:justify-center justify-between w-full h-full items-center gap-14">
        <div className="w-24 h-24 lg:w-44 lg:h-44 rounded-md bg-gradient-to-br from-primary to-secondary justify-center items-center flex flex-col animate-getBigger animate-biggerSmaller ml-auto">
          <div className="w-24 h-24 lg:w-44 lg:h-44 rounded-md justify-center items-center flex flex-col sckeliton ">
            <Avatar>
              <AvatarImage
                src={leftUserBottom?.avatar}
                alt="profile image"
                className="w-20 h-20 lg:w-40 lg:h-40 rounded-md bg-primary/35"
                />
              <AvatarFallback className="rounded-sm w-20 h-20 lg:w-40 lg:h-40 text-3xl lg:text-9xl font-bold">
                ?
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        <div className="w-24 h-24 lg:w-44 lg:h-44 rounded-md bg-gradient-to-br from-primary to-secondary justify-center items-center flex flex-col animate-getBigger animate-biggerSmaller mr-auto">
          <div className="w-24 h-24 lg:w-44 lg:h-44 rounded-md justify-center items-center flex flex-col sckeliton ">
            <Avatar>
              <AvatarImage
                src={rightUserBottom?.avatar}
                alt="profile image"
                className="w-20 h-20 lg:w-40 lg:h-40 rounded-md bg-primary/35"
                />
              <AvatarFallback className="rounded-sm w-20 h-20 lg:w-40 lg:h-40 text-3xl lg:text-9xl font-bold">
                ?
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
      )
      }
    </div>
  );
};

export default PreGame;
