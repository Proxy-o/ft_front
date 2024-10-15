"use client";

import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useState } from "react";

const TwoVTwo = () => {
  const [hover, setHover] = useState(false);
  return (
    <><Card
    className={`w-44 h-44 bg-background flex flex-col justify-center items-center rounded-xl shadow-primary shadow-sm transition duration-300 ease-in-out relative overflow-hidden`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          className={
            `absolute w-full h-full flex flex-col justify-center items-center transition duration-300 ease-in-out` +
            (hover
              ? "transform blur-sm scale-75 opacity-25"
              : "transform blur-none")
          }
        >
          <Users size={150} />
        </div>
        {hover && <div className="text-4xl font-bold">2 v 2</div>}
        <div
          className={`w-full h-full flex flex-row justify-between items-left transition duration-300 ease-in-out ${
            hover ? "opacity-100" : "opacity-0"
          } absolute`}
        >
          <div className="flex flex-col justify-between items-center h-4/6 w-3">
            <div className="bg-primary h-20 w-3 animate-moveUpLeft"></div>
            <div className="bg-primary h-20 w-3 animate-moveDownLeft"></div>
          </div>
          <div className="h-full w-full">
            <div className="bg-primary h-[10px] w-[10px] animate-moveArround"></div>
          </div>
          <div className="flex flex-col justify-between items-center h-4/6 w-3">
            <div className="bg-primary h-20 w-3 animate-moveUpRight"></div>
            <div className="bg-primary h-20 w-3 animate-moveDownRight"></div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default TwoVTwo;
