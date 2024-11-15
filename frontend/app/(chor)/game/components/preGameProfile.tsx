import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PreGameProfile = ({ avatar, side }: { avatar: string; side: string }) => {
  if (side === "left") {
    return (
      <div className="w-12 h-12 sm:w-22 sm:h-22 md:w-32 md:h-32 rounded-md justify-center items-center flex flex-col animate-getBigger animate-biggerSmaller ml-auto overflow-hidden">
        <div className="w-80 h-80 rounded-md justify-center items-center flex flex-col sckeliton rotate-45 absolute">
          <Avatar className="w-10 h-10 sm:w-18 sm:h-18 md:w-28 md:h-28 rounded-md bg-primary/35 -rotate-45">
            {avatar !== "none" && (
              <AvatarImage src={avatar} alt="profile image" />
            )}
            <AvatarFallback className="rounded-sm w-10 h-10 sm:w-18 sm:h-18 md:w-28 md:h-28 text-3xl md:text-9xl font-bold bg-primary/35 text-secondary">
              ?
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    );
  } else if (side === "right") {
    return (
      <div className="w-12 h-12 sm:w-22 sm:h-22 md:w-32 md:h-32 rounded-md justify-center items-center flex flex-col animate-getBigger animate-biggerSmaller ml-auto overflow-hidden">
        <div className="w-80 h-80 rounded-md justify-center items-center flex flex-col sckeliton2 rotate-45 absolute">
          <Avatar className="w-10 h-10 sm:w-18 sm:h-18 md:w-28 md:h-28 rounded-md bg-primary/35 -rotate-45">
            {avatar !== "none" && (
              <AvatarImage src={avatar} alt="profile image" />
            )}
            <AvatarFallback className="rounded-sm w-10 h-10 sm:w-18 sm:h-18 md:w-28 md:h-28 text-3xl md:text-9xl font-bold bg-primary/35 text-secondary">
              ?
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    );
  }
};

const ScoreProfile = ({
  avatar,
  side = "left",
  number,
  alias,
}: {
  avatar: string;
  side?: string;
  number?: number;
  alias?: string;
}) => {
  if (side === "left") {
    return (
      <div className="w-12 h-16 rounded-md scale-75 sm:scale-100 justify-center items-center flex flex-row animate-getBigger animate-biggerSmaller gap-4 bg-blue-500">
        <div className="h-full w-full flex justify-center items-center bg-purple-600 rounded-md">
          <Avatar className="w-10 h-10 rounded-md bg-primary/35">
            {avatar !== "none" && (
              <AvatarImage src={avatar} alt="profile image" />
            )}
            {avatar === "local" ? (
              <AvatarFallback className="rounded-sm w-10 h-10 text-sm font-bold ">
                {alias || ("Player " + "1")}
              </AvatarFallback>
            ) : (
              <AvatarFallback className="rounded-sm w-10 h-10 text-3xl font-bold bg-primary/35 text-secondary">
                ?
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </div>
    );
  } else if (side === "right") {
    return (
      <div className="w-12 h-16 rounded-md scale-75 sm:scale-100 justify-center items-center flex flex-row animate-getBigger animate-biggerSmaller gap-4">
        <div className="h-full w-full bg-cyan-700 flex justify-center items-center rounded-md">
          <Avatar className="w-10 h-10 rounded-md bg-primary/35">
            {avatar !== "none" && (
              <AvatarImage src={avatar} alt="profile image" />
            )}
            {avatar === "local" ? (
              <AvatarFallback className="rounded-sm w-10 h-10 text-sm font-bold ">
                {alias || ("Player " + "2")}
              </AvatarFallback>
            ) : (
              <AvatarFallback className="rounded-sm w-10 h-10 text-3xl font-bold bg-primary/35 text-secondary">
                ?
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </div>
    );
  }
};

export { PreGameProfile, ScoreProfile };
