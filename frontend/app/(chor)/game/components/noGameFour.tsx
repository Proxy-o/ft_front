import { useEffect, useRef } from "react";

const NoGameFour = ({ state }: { state: React.MutableRefObject<string> }) => {
  const atext = useRef<string>("Invite a friend to play");

  useEffect(() => {
    if (state.current === "win") {
      atext.current = "You won";
    } else if (state.current === "lose") {
      atext.current = "You lose";
    } else if (state.current === "surrender") {
      atext.current = "Your enemy has surrendered";
    } else if (state.current === "surrendered") {
      atext.current = "Your teamate has surrendered";
    } else if (state.current === "none") {
      atext.current = "Invite a friend to play";
    } else if (state.current === "left") {
      atext.current = "The left player wins the game";
    } else if (state.current === "right") {
      atext.current = "The right player wins the game";
    } else if (state.current === "local") {
      atext.current = "Start a local game";
    } else if (state.current === "teamLeft") {
      atext.current = "Your taamate has left the game";
    } else if (state.current === "teamLeftOpponent") {
      atext.current = "Your opponent's teammate has left the game\nYou win";
    } else {
      atext.current = "Invite a friend to play";
    }
  }, [state, state.current]);

  return (
    <div className="w-full h-full relative flex flex-col rounded-lg justify-between p-4">
      <div
        className="absolute inset-0 rounded-lg w-full h-full"
        style={{
          backgroundImage: "url('/bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.75,
        }}
      />
      <div className="flex text-white z-10 text-sm md:text-2xl m-auto text-center">
        {atext.current}
      </div>
    </div>
  );
};

export default NoGameFour;
