"use client";

import { Crown, User } from "lucide-react";
import { useState } from "react";
import { Separator } from "@radix-ui/react-separator";

const TournamentNav = () => {
  const [hover, setHover] = useState(false);
  return (
    <>
      <div
        className={`w-44 h-44 bg-background flex flex-col justify-center items-center rounded-xl shadow-primary shadow-sm transition duration-300 ease-in-out hover:shadow-lg hover:shadow-primary/20 relative`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          className={
            `absolute w-full h-full flex flex-col justify-center items-center transition duration-300 ease-in-out` +
            (hover ? "transform blur-sm" : "transform blur-none")
          }
        >
          <div
            className={
              `transition duration-500 ease-in-out` +
              (hover ? "transform scale-0" : "")
            }
          >
            <Crown size={150} />
          </div>
        </div>
        {hover && (
          <div className="text-lg font-bold mt-auto mb-10 transition duration-75 animate-moveDownTournament scale-150">
            Tournament
          </div>
        )}
        {hover && (
          <div
            className={`w-full h-full flex flex-row justify-between items-left transition duration-1000 ease-in-out ${
              hover ? "scale-100" : "scale-0"
            } absolute`}
          >
            <div className="flex flex-row mx-auto relative">
              <div className="flex flex-col justify-start items-start gap-20 my-auto">
                <div className="absolute top-8 left-0 animate-moveLeft">
                  <User size={24} className="text-primary" />
                </div>
                <div className="bottom-8 left-0 opacity-0">
                  <User size={24} className="text-primary" />
                </div>
                <User size={24} className="text-primary" />
              </div>
              <div className="flex flex-col justify-start items-start gap-[116px] my-auto py-4">
                <Separator className="w-6 h-[2px] bg-white " />
                <Separator className="w-6 h-[2px] bg-white" />
              </div>
              <div className="m-auto flex flex-col justify-start items-start gap-14">
                <Separator className="h-[120px] w-[2px] bg-white" />
              </div>
              <div className="flex flex-col justify-start items-start gap-[118px] my-auto">
                <Separator className="w-6 h-[2px] bg-white" />
              </div>
              <div className="flex flex-col justify-start items-start my-auto"></div>
              <div className="flex flex-col justify-center items-center gap-4 my-auto py-4">
                <div className="absolute top-16 left-116 animate-crown">
                  <Crown size={24} className="text-yellow-500" />
                </div>
                <div className="w-8 h-8"></div>
              </div>
              <div className="flex flex-col justify-start items-start my-auto"></div>
              <div className="flex flex-col justify-start items-start gap-[118px] my-auto">
                <Separator className="w-6 h-[2px] bg-white" />
              </div>
              <div className="m-auto flex flex-col justify-start items-start gap-14">
                <Separator className="h-[120px] w-[2px] bg-white" />
              </div>
              <div className="flex flex-col justify-start items-start gap-[116px] my-auto py-4">
                <Separator className="w-6 h-[2px] bg-white " />
                <Separator className="w-6 h-[2px] bg-white" />
              </div>
              <div className="flex flex-col justify-start items-start gap-20 my-auto">
                <User size={24} className="text-primary" />
                <div className="bottom-8 left-0 opacity-0">
                  <User size={24} className="text-primary" />
                </div>
                <div className="absolute top-36 left-[154px] animate-moveRight">
                  <User size={24} className="text-primary" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TournamentNav;
