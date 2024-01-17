import React from "react";
import UserInfo from "./compononts/userInfo";
import GamesTable from "./compononts/gamesTable";

export default function page() {
  return (
    <div>
      <UserInfo />
      <GamesTable />
    </div>
  );
}
