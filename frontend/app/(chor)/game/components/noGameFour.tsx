import { useEffect, useState,  } from "react";

const NoGameFour = ({ state }: { state: string }) => {
  const [atext, setAtext] = useState<string>("Invite a friend to play");

  useEffect(() => {

    if (state === "win") {
      setAtext("You won");
    } else if (state === "lose") {
      setAtext("You lose");
    } else if (state === "surrender") {
      setAtext("Your enemy has surrendered");
    } else if (state === "surrendered") {
      setAtext("Your teamate has surrendered");
    } else if (state === "none") {
      setAtext("Invite a friend to play");
    } else if (state === "left") {
      setAtext("The left player wins the game");
    } else if (state === "right") {
      setAtext("The right player wins the game");
    } else if (state === "local") {
      setAtext("Start a local game");
    } else if (state === "teamLeft") {
      setAtext("Your teamate has left the game");
    } else if (state === "teamLeftOpponent") {
      setAtext("Your opponent has left the game You win");
    } else {
      setAtext("Invite a friend to play");
    }
  }, [state]);

  return (
    <div className="w-full h-full relative flex flex-col rounded-lg justify-between p-4">
      <div className="absolute inset-0 rounded-lg w-full h-full" />
      <div className="flex text-white z-10 text-sm md:text-2xl m-auto text-center">
        {atext}
      </div>
    </div>
  );
};

export default NoGameFour;
