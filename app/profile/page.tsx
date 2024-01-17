import React from "react";
import UserInfo from "./compononts/userInfo";
import GamesTable from "./compononts/gamesTable";
import States from "./compononts/states";
import Friends from "./compononts/friends";

export default function page() {
  return (
    <div className="lg:flex justify-center gap-4 p-4">
      <div className="flex flex-col gap-4 mb-4">
        <UserInfo />
        <GamesTable />
      </div>
      <div className="flex flex-col gap-4">
        <States />
        <Friends />
      </div>
    </div>
  );
}
