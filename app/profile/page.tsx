import React from "react";
import UserInfo from "./compononts/userInfo";
import GamesTable from "./compononts/gamesTable";
import States from "./compononts/states";

export default function page() {
  return (
    <div className="lg:flex justify-center gap-4 p-4">
      <div className="flex flex-col gap-4 mb-4">
        <UserInfo />
        <GamesTable />
      </div>
      <States />
    </div>
  );
}
