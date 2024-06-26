import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

const NoGame = ({ state }: { state: React.MutableRefObject<string> }) => {
  const atext = useRef<string>("Invite a friend to play");

  const letterIndex = useRef(0);
  const [text, setText] = useState("");
  useEffect(() => {
    console.log(state.current);
    if (state.current === "win") {
      atext.current = "You won";
    } else if (state.current === "lose") {
      atext.current = "You lose";
    } else if (state.current === "surrendered") {
      atext.current = "Your enemy has surrendered";
    } else if (state.current === "none") {
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
      className="w-full md:h-[400px] h-[300px] bg-black flex flex-col rounded-lg"
      style={{
        backgroundImage: "url('/game.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="text-white text-3xl m-auto text-container">{text}</div>
      {state.current !== "none" && (
        <Button
          className="m-auto"
          onClick={() => {
            state.current = "none";
            setText("");
            letterIndex.current = 0;
          }}
        >
          Play again
        </Button>
      )}
    </div>
  );
};

export default NoGame;
