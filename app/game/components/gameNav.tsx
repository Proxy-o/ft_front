import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { Dispatch, SetStateAction, useState } from "react";
import Invitations from "./invitations";
import InviteFriends from "./inviteFriend";

const GameNav = ({
  setTab,
  tab,
}: {
  setTab: Dispatch<SetStateAction<string>>;
  tab: string;
}) => {
  const [showInvitations, setShowInvitations] = useState(false);
  return (
    <>
      <nav className="mx-auto mt-2 w-fit h-fit flex flex-row justify-start items-start gap-2 p-2 bg-background">
        <div
          className="bg-background"
          onMouseEnter={() => setShowInvitations(true)}
          onMouseLeave={() => setShowInvitations(false)}
        >
          <Button
            variant={tab === "online" ? "default" : "ghost"}
            size={"sm"}
            onClick={() => setTab("online")}
            className="relative"
          >
            Play Online
          </Button>
          <div className="absolute top-12 h-5 w-24"></div>
          {showInvitations && (
            <div className="w-fit h-fit flex flex-col justify-start items-start p-9 top-[3.75rem] absolute border-secondary border-2 rounded-md bg-inherit shadow-sm shadow-primary">
              <Invitations setTab={setTab} />
              <Separator className="w-full mt-4" />
              <InviteFriends />
            </div>
          )}
        </div>
        <Button
          variant={tab === "local" ? "default" : "ghost"}
          size={"sm"}
          onClick={() => setTab("local")}
        >
          Play Local
        </Button>
        <Button
          variant={tab === "four" ? "default" : "ghost"}
          size={"sm"}
          onClick={() => setTab("four")}
        >
          Four Players
        </Button>
        <Button
          variant={tab === "tournament" ? "default" : "ghost"}
          size={"sm"}
          onClick={() => setTab("tournament")}
        >
          Tournament
        </Button>
      </nav>
      <Separator className="w-full" />
    </>
  );
};

export default GameNav;
