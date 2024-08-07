import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

const NoGameFour = ({
  state,
}: {
  state: React.MutableRefObject<string>;
}) => {
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
    } else if (state.current === "left") {
      atext.current = "The left player wins the game";
    } else if (state.current === "right") {
      atext.current = "The right player wins the game";
    } else if (state.current === "local") {
      atext.current = "Start a local game";
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
      className="w-full h-full bg-black flex flex-col rounded-lg justify-between p-4"
      style={{
        backgroundImage: "url('/game.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {state.current !== "none" &&
        state.current !== "left" &&
        state.current !== "right" &&
        state.current !== "local" && (
          <>
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
          </>
        )}
    </div>
  );
};

export default NoGameFour;
