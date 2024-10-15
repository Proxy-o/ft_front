import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useGameSocket from "../hooks/sockets/useGameSocket";
import { canvasParams } from "../types";
import { Button } from "@/components/ui/button";
import { DoorOpen, Flag, Gamepad, Pause } from "lucide-react";

const Actions = ({
  gameStarted,
  setGameStarted,
}: {
  gameStarted: boolean;
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="w-full h-fit absolute bottom-4 items-center justify-center flex">
      <div className="w-1/2 flex flex-row justify-center items-center gap-4">
        {!gameStarted ? (
          <TooltipProvider delayDuration={0}>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {
                    setGameStarted(true);
                  }}
                  className="h-fit w-fit bg-green-600"
                >
                  <Gamepad size={25} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Start</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <TooltipProvider delayDuration={0}>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {
                    setGameStarted(false);
                  }}
                  className="h-fit w-fit bg-yellow-500/55"
                >
                  <Pause size={25} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Pause Game</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
};

export default Actions;
