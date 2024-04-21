import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Invitations from "./invitations";
import InviteFriends from "./inviteFriend";

const GameNav = ({
  setTab,
  tab,
}: {
  setTab: Dispatch<SetStateAction<string>>;
  tab: string;
}) => {
  const [showInvitations_1, setShowInvitations_1] = useState(false);
  const [showInvitations_2, setShowInvitations_2] = useState(false);
  const [showInvitations_3, setShowInvitations_3] = useState(false);

  const [local, setLocal] = useState("Play Local");
  const [online, setOnline] = useState("Play Online");
  const [four, setFour] = useState("Four Players");

  function checkScreenSize() {
    if (window.innerWidth <= 640) {
      // 640px is the default breakpoint for 'sm:' in Tailwind CSS
      setLocal("Local");
      setOnline("Online");
      setFour("Four");
    } else {
      setLocal("Play Local");
      setOnline("Play Online");
      setFour("Four Players");
    }
  }

  // Check screen size on load
  useEffect(() => {
    checkScreenSize();
  }),
    [];

  // Listen for window resize
  window.addEventListener("resize", checkScreenSize);
  return (
    <>
      <nav className="mt-6 md:mt-2 w-fit h-fit flex flex-row md:gap-2 pb-2">
        {(showInvitations_1 || showInvitations_2 || showInvitations_3) && (
          <>
            <div
              className="absolute top-12 md:top-8 h-5 w-11/12 md:w-24"
              onMouseEnter={() => setShowInvitations_1(true)}
              onMouseLeave={() => setShowInvitations_1(false)}
            ></div>
            <div
              onMouseEnter={() => setShowInvitations_3(true)}
              onMouseLeave={() => setShowInvitations_3(false)}
              id="dropdown"
              className="w-[400px] h-fit flex flex-col justify-start items-start p-2 top-[68px] md:top-[52px] absolute border-secondary border-2 rounded-md shadow-sm shadow-primary bg-background"
            >
              <Invitations setTab={setTab} />
              <Separator className="w-full mt-4" />
              <InviteFriends gameType="two" />
            </div>
          </>
        )}
        <div className="w-full flex">
          <Button
            onMouseEnter={() => setShowInvitations_2(true)}
            onMouseLeave={() => setShowInvitations_2(false)}
            id="online"
            variant={tab === "online" ? "default" : "ghost"}
            size={"sm"}
            onClick={() => setTab("online")}
          >
            {online}
          </Button>
          <Button
            id="local"
            variant={tab === "local" ? "default" : "ghost"}
            size={"sm"}
            onClick={() => setTab("local")}
          >
            {local}
          </Button>
          <Button
            id="four"
            variant={tab === "four" ? "default" : "ghost"}
            size={"sm"}
            onClick={() => setTab("four")}
          >
            {four}
          </Button>
          <Button
            id="tournament"
            variant={tab === "tournament" ? "default" : "ghost"}
            size={"sm"}
            onClick={() => setTab("tournament")}
          >
            Tournament
          </Button>
        </div>
      </nav>
      <Separator className="w-full" />
    </>
  );
};

export default GameNav;
