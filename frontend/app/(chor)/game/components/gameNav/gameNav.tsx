import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Dispatch, SetStateAction, useState } from "react";
import Invitations from "../invitations";
import { User, Users } from "lucide-react";

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
              <Invitations mode="all" />
            </div>
          </>
        )}
        <div className="w-full flex">
          <Button
            onMouseEnter={() => setShowInvitations_2(true)}
            onMouseLeave={() => setShowInvitations_2(false)}
            id="two"
            variant={tab === "two" ? "default" : "ghost"}
            size={"sm"}
            onClick={() => setTab("two")}
            className="flex items-center gap-1"
          >
            <User size={20} /> 1 v 1
          </Button>
          <Button
            id="local"
            variant={tab === "local" ? "default" : "ghost"}
            size={"sm"}
            onClick={() => setTab("local")}
          >
            Local
          </Button>
          <Button
            id="four"
            variant={tab === "four" ? "default" : "ghost"}
            size={"sm"}
            onClick={() => setTab("four")}
            className="flex items-center gap-1"
          >
            <Users size={16} />2 v 2
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
