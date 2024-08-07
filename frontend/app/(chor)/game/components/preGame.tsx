import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/lib/types";
import { Avatar } from "@radix-ui/react-avatar";

const PreGame = ({
  leftUser,
  rightUser,
}: {
  leftUser: React.MutableRefObject<User | undefined>;
  rightUser: React.MutableRefObject<User | undefined>;
}) => {
  return (
    <div className="flex flex-row lg:justify-center justify-between w-full h-full items-center">
      <div className="w-24 h-24 lg:w-52 lg:h-52 rounded-md bg-gradient-to-br from-primary to-secondary justify-center items-center flex flex-col animate-getBigger animate-biggerSmaller ml-auto">
        <div className="w-24 h-24 lg:w-52 lg:h-52 rounded-md justify-center items-center flex flex-col sckeliton ">
          <Avatar>
            <AvatarImage
              src={leftUser.current?.avatar}
              alt="profile image"
              className="w-20 h-20 lg:w-48 lg:h-48 rounded-md bg-primary/35"
            />
            <AvatarFallback className="rounded-sm w-20 h-20 lg:w-48 lg:h-48 text-3xl lg:text-9xl font-bold">
              ?
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="w-10 h-10 flex items-center justify-center m-auto">
        <h1 className="text-5xl lg:text-7xl text-white font-bold">VS</h1>
      </div>
      <div className="w-24 h-24 lg:w-52 lg:h-52 rounded-md bg-gradient-to-br from-primary to-secondary justify-center items-center flex flex-col animate-getBigger animate-biggerSmaller mr-auto">
        <div className="w-24 h-24 lg:w-52 lg:h-52 rounded-md justify-center items-center flex flex-col sckeliton ">
          <Avatar>
            <AvatarImage
              src={rightUser.current?.avatar}
              alt="profile image"
              className="w-20 h-20 lg:w-48 lg:h-48 rounded-md bg-primary/35"
            />
            <AvatarFallback className="rounded-sm w-20 h-20 lg:w-48 lg:h-48 text-3xl lg:text-9xl font-bold">
              ?
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default PreGame;
