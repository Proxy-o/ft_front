import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { Dispatch, SetStateAction } from "react";

const GameNav = ({
  setTab,
  tab,
}: {
  setTab: Dispatch<SetStateAction<string>>;
  tab: string;
}) => {
  return (
    <>
      <nav className="mx-auto mt-2 w-fit h-fit flex flex-row justify-start items-start dark:text-white gap-2 p-2">
        <Button
          variant={tab === "online" ? "default" : "ghost"}
          size={"sm"}
          onClick={() => setTab("online")}
        >
          Play Online
        </Button>
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
