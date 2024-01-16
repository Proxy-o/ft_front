import React from "react";
import NavSkel from "./navSkel";
import MainSkel from "./mainSkel";

export default function HomeSkel() {
  return (
    <div className="flex ">
      <NavSkel />
      <MainSkel />
    </div>
  );
}
