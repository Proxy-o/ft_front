import { Button } from "@/components/ui/button";
import { User } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NoGameFour = ({
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  state,
}: {
  topLeft: React.MutableRefObject<User>;
  topRight: React.MutableRefObject<User>;
  bottomLeft: React.MutableRefObject<User>;
  bottomRight: React.MutableRefObject<User>;
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
      <div className="flex flex-row justify-between">
        <div className="flex flex-col w-1/2 items-center justify-center">
          <Avatar className="mx-auto w-fit h-fit">
            <AvatarImage
              src={topLeft.current.avatar}
              alt="profile image"
              className="rounded-full h-10 md:h-16 w-10 md:w-16"
            />
            <AvatarFallback className="rounded-full h-10 md:h-16 w-10 md:w-16 text-xs md:text-base bg-primary">
              Player
            </AvatarFallback>
          </Avatar>
          <h1 className="">{topLeft.current.username}</h1>
        </div>
        <div className="flex flex-col w-1/2 items-center justify-center">
          <Avatar className="mx-auto w-fit h-fit">
            <AvatarImage
              src={topRight.current.avatar}
              alt="profile image"
              className="rounded-full h-10 md:h-16 w-10 md:w-16"
            />
            <AvatarFallback className="rounded-full h-10 md:h-16 w-10 md:w-16 text-xs md:text-base bg-primary">
              Player
            </AvatarFallback>
          </Avatar>
          <h1 className="">{topRight.current.username}</h1>
        </div>
      </div>
      {/* <div className="text-white text-xl md:text-3xl m-auto text-container mx-auto">
        {text}
      </div> */}
      <div className="flex flex-row justify-between">
        <div className="flex flex-col w-1/2 items-center justify-center">
          <Avatar className="mx-auto w-fit h-fit">
            <AvatarImage
              src={bottomLeft.current.avatar}
              alt="profile image"
              className="rounded-full h-10 md:h-16 w-10 md:w-16"
            />
            <AvatarFallback className="rounded-full h-10 md:h-16 w-10 md:w-16 text-xs md:text-base bg-primary">
              Player
            </AvatarFallback>
          </Avatar>
          <h1 className="">{bottomLeft.current.username}</h1>
        </div>
        <div className="flex flex-col w-1/2 items-center justify-center">
          <Avatar className="mx-auto w-fit h-fit">
            <AvatarImage
              src={bottomRight.current.avatar}
              alt="profile image"
              className="rounded-full h-10 md:h-16 w-10 md:w-16"
            />
            <AvatarFallback className="rounded-full h-10 md:h-16 w-10 md:w-16 text-xs md:text-base bg-primary">
              Player
            </AvatarFallback>
          </Avatar>
          <h1 className="">{bottomRight.current.username}</h1>
        </div>
      </div>
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
