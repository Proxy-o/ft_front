import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PreGameProfile = ({ avatar, side }: { avatar: string; side: string }) => {
  if (side === "left") {
    return (
      <div className="w-24 h-24 lg:w-44 lg:h-44 rounded-md justify-center items-center flex flex-col animate-getBigger animate-biggerSmaller ml-auto overflow-hidden">
        <div className="w-80 h-80 rounded-md justify-center items-center flex flex-col sckeliton rotate-45 absolute">
          <Avatar className="w-20 h-20 lg:w-36 lg:h-36 rounded-md bg-primary/35 -rotate-45">
            <AvatarImage src={avatar} alt="profile image" />
            <AvatarFallback className="rounded-sm w-20 h-20 lg:w-36 lg:h-36 text-3xl lg:text-9xl font-bold bg-primary/35 text-secondary">
              ?
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    );
  } else if (side === "right") {
    return (
      <div className="w-24 h-24 lg:w-44 lg:h-44 rounded-md justify-center items-center flex flex-col animate-getBigger animate-biggerSmaller ml-auto overflow-hidden">
        <div className="w-80 h-80 rounded-md justify-center items-center flex flex-col sckeliton2 rotate-45 absolute">
          <Avatar className="w-20 h-20 lg:w-36 lg:h-36 rounded-md bg-primary/35 -rotate-45">
            <AvatarImage src={avatar} alt="profile image" />
            <AvatarFallback className="rounded-sm w-20 h-20 lg:w-36 lg:h-36 text-3xl lg:text-9xl font-bold bg-primary/35 text-secondary">
              ?
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    );
  }
};

export default PreGameProfile;
