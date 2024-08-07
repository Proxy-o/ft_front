"use client";

import React from "react";
import Game from "./game";

const Two = ({ type }: { type: string }) => {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
          <Game type={type} />
    </div>
  );
};

export default Two;
