import React from "react";
import UserInfo from "./compononts/userInfo";
import GamesTable from "./compononts/gamesTable";
import States from "./compononts/states";

export default function page() {
  return (
    <div>
      <UserInfo />
      <GamesTable />
      <States />
    </div>
  );
}
