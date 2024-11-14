import { useEffect, useRef, useState } from "react";

const NoGame = ({ state }: { state: React.MutableRefObject<string> }) => {
  const [atext, setAtext] = useState<string>("Invite a friend to play");
  console.log(state.current);

  useEffect(() => {
    if (state.current === "win") {
      setAtext("You won");
    } else if (state.current === "lose") {
      setAtext("You lose");
    } else if (state.current === "surrender") {
      setAtext("Your teammate has surrendered");
    } else if (state.current === "surrendered") {
      setAtext("Your enemy has surrendered");
    } else if (state.current === "none") {
      setAtext("Invite a friend to play");
    } else if (state.current === "left") {
      setAtext("The left player wins the game");
    } else if (state.current === "right") {
      setAtext("The right player wins the game");
    } else if (state.current === "local") {
      setAtext("Start a local game");
    } else if (state.current === "tournament") {
      setAtext("Join a tournament");
    } else if (state.current === "leave") {
      setAtext("Your enemy has left the game");
    }
  }, [state.current, state]);

  return (
    <div className="w-full h-full flex flex-col relative rounded-lg">
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          backgroundImage: "url('/bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.75,
        }}
      />
      <div className="text-white text-xl z-20 md:text-3xl m-auto text-container">
        {atext}
      </div>
    </div>
  );
};

export default NoGame;
