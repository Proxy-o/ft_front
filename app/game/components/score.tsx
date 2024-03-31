import React from "react";

export default function Score({
  leftPlayerScore,
  rightPlayerScore,
}: {
  leftPlayerScore: number;
  rightPlayerScore: number;
}) {
  return (
    <div className="flex flex-row justify-between items-center w-5/6 h-16 mx-auto">
      <div className="flex flex-row justify-start items-center w-1/2">
        <div className="w-6 h-6 bg-white rounded-full flex justify-center items-center text-black font-bold">
          {leftPlayerScore}
        </div>
        <div className="text-white ml-2">Player 1</div>
      </div>
      <div className="flex flex-row justify-end items-center w-1/2">
        <div className="text-white mr-2">Player 2</div>
        <div className="w-6 h-6 bg-white rounded-full flex justify-center items-center text-black font-bold">
          {rightPlayerScore}
        </div>
      </div>
    </div>
  );
}
