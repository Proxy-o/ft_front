import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

const NoGameFour = ({ state }: { state: React.MutableRefObject<string> }) => {
  const atext = useRef<string>("Invite a friend to play");

  const letterIndex = useRef(0);
  const [text, setText] = useState("");
  useEffect(() => {
    if (state.current === "win") {
      atext.current = "You won";
    } else if (state.current === "lose") {
      atext.current = "You lose";
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
    } else {
      atext.current = "Invite a friend to play";
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
      className="w-full h-full relative bg-black flex flex-col rounded-lg justify-between p-4"
      
    >
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          backgroundImage: "url('/bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.75,
        }}
      />
      <div className="text-white z-10 text-2xl m-auto">{text}</div>
    </div>
  );
};

export default NoGameFour;
