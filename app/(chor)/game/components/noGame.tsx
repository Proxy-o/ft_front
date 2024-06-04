import { Card } from "@/components/ui/card";
import Image from "next/image";
import { use, useEffect, useRef, useState } from "react";

const NoGame = () => {
  const atext = "Invite a friend to play";
  const letterIndex = useRef(0);
  const [text, setText] = useState("");

  useEffect(() => {
    setTimeout(() => {
      if (letterIndex.current < atext.length) {
        letterIndex.current++;
        setText(atext.slice(0, letterIndex.current));
      }
    }, 30);
  }, [text]);

  return (
    <div
      className="w-full md:h-[400px] h-[300px] max-w-[800px] bg-black flex rounded-lg"
      style={{
        backgroundImage: "url('/game.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="text-white text-3xl m-auto text-container">{text}</div>
    </div>
  );
};

export default NoGame;
