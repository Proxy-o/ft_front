"use client";

import { Card } from "@/components/ui/card";
import { Diamond, User, Wifi } from "lucide-react";
import { useState } from "react";

const OneVOne = ({ type }: { type: string }) => {
  const [hover, setHover] = useState(false);
  return (
    <>
      <Card
        className={`w-44 h-44 bg-background flex cursor-pointer flex-col justify-center items-center rounded-xl shadow-primary shadow-sm transition duration-300 ease-in-out relative overflow-hidden`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {type === "two" && (
          <>
            <div
              className={
                `absolute w-full h-full flex flex-col justify-center items-center transition duration-300 ease-in-out` +
                (hover
                  ? "transform scale-75 blur-sm opacity-25"
                  : "transform scale-100")
              }
            >
              <div
                className={
                  `transition duration-2000 ease-in-out` +
                  (hover ? "transform animate-in" : "transform animate-none")
                }
              >
                <User size={150} />
              </div>
            </div>
            {hover && <div className="text-4xl font-bold">1 v 1</div>}
          </>
        )}
        {type === "local" && (
          <>
            <div
              className={
                `absolute w-full h-full flex flex-col justify-center items-center transition duration-300 ease-in-out` +
                (hover ? "transform blur-sm" : "transform blur-none")
              }
            >
              <div
                className={
                  `transition duration-300 ease-in-out` +
                  (hover ? "transform rotate-45" : "transform rotate-0")
                }
              >
                <Diamond size={150} />
              </div>
            </div>
            {hover && <div className="text-2xl font-bold">Local</div>}
          </>
        )}
        {type === "online" && (
          <>
            <div
              className={
                `absolute w-full h-full flex flex-col justify-center items-center transition duration-300 ease-in-out` +
                (hover
                  ? "transform scale-75 blur-sm opacity-25"
                  : "transform scale-100")
              }
            >
              <div
                className={
                  `transition duration-300 ease-in-out` +
                  (hover ? "transform animate-in" : "transform animate-none")

                }
              >
                <Wifi size={150} />
              </div>
            </div>
            {hover && <div className="text-2xl font-bold">Online</div>}
          </>
        )}
        <div
          className={`w-full h-full flex flex-row justify-between items-left transition duration-300 ease-in-out ${
            hover ? "opacity-100" : "opacity-0"
          } absolute`}
        >
          <div className="bg-primary h-[68px] w-3 animate-moveDownOne"></div>
          <div className="h-full w-full">
            <div className="bg-primary h-[10px] w-[10px] animate-moveArround"></div>
          </div>
          <div className="bg-primary  h-[68px] w-3 animate-moveUpOne"></div>
        </div>
      </Card>
    </>
  );
};

export default OneVOne;
