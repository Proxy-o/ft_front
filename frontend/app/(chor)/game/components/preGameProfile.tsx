import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PreGameProfile = ({ avatar, side }: { avatar: string; side: string }) => {
  if (side === "left") {
    return (
      <div className="w-24 h-24 lg:w-44 lg:h-44 rounded-md justify-center items-center flex flex-col animate-getBigger animate-biggerSmaller ml-auto">
        <div className="w-24 h-24 lg:w-44 lg:h-44 rounded-md justify-center items-center flex flex-col sckeliton">
          <Avatar className="w-20 h-20 lg:w-40 lg:h-40 rounded-md bg-primary/35">
            <AvatarImage src={avatar} alt="profile image" />
            <AvatarFallback className="rounded-sm w-20 h-20 lg:w-40 lg:h-40 text-3xl lg:text-9xl font-bold bg-primary/35 text-secondary">
              ?
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    );
  } else if (side === "right") {
    return (
      <div className="w-24 h-24 lg:w-44 lg:h-44 rounded-md justify-center items-center flex flex-col animate-getBigger animate-biggerSmaller ml-auto">
        <div className="w-24 h-24 lg:w-44 lg:h-44 rounded-md justify-center items-center flex flex-col sckeliton2">
          <Avatar className="w-20 h-20 lg:w-40 lg:h-40 rounded-md bg-primary/35">
            <AvatarImage src={avatar} alt="profile image" />
            <AvatarFallback className="rounded-sm w-20 h-20 lg:w-40 lg:h-40 text-3xl lg:text-9xl font-bold bg-primary/35 text-secondary">
              ?
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    );
  }
};

export default PreGameProfile;
