import { useEffect, useRef, useState } from "react";

const NoGame = ({ state }: { state: React.MutableRefObject<string> }) => {
  const atext = useRef<string>("Invite a friend to play");

  const letterIndex = useRef(0);
  const [text, setText] = useState("");
  useEffect(() => {
    if (state.current === "win") {
      atext.current = "You won";
    } else if (state.current === "lose") {
      atext.current = "You lose";
    } else if (state.current === "surrender") {
      atext.current = "Your teammate has surrendered";
    } else if (state.current === "surrendered") {
      atext.current = "Your enemy has surrendered";
    } else if (state.current === "none") {
      atext.current = "Invite a friend to play";
    } else if (state.current === "left") {
      atext.current = "The left player wins the game";
    } else if (state.current === "right") {
      atext.current = "The right player wins the game";
    } else if (state.current === "local") {
      atext.current = "Start a local game";
    } else if (state.current === "tournament") {
      atext.current = "Join a tournament";
    } else if (state.current === "leave") {
      atext.current = "Your enemy has left the game";
    }
    setTimeout(() => {
      if (letterIndex.current < atext.current.length) {
        letterIndex.current++;
        setText(atext.current.slice(0, letterIndex.current));
      }
    }, 30);
  }, [text]);

  return (
    <div
      className="w-full h-full flex flex-col rounded-lg"
      style={{
        backgroundImage: "url('/game.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="text-white text-xl md:text-3xl m-auto text-container">
        {text}
      </div>
    </div>
  );
};

export default NoGame;
