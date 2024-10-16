import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Gamepad, Pause, DoorOpen } from "lucide-react";

const Actions = ({
  gameStarted,
  setGameStarted,
  setLeftScore,
  setRightScore,
  type,
}: {
  gameStarted: boolean;
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setLeftScore: React.Dispatch<React.SetStateAction<number>>;
  setRightScore: React.Dispatch<React.SetStateAction<number>>;
  type: "game" | "tournament";
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
          <>
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
          {type === "game" && (
            <>
            <TooltipProvider delayDuration={0}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      setLeftScore(0);
                      setRightScore(0);
                      setGameStarted(false);
                    }}
                    className="h-fit w-fit bg-red-500/55"
                    >
                    <DoorOpen size={25} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>End Game</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            </>
          )}
          </>
        )}
      </div>
    </div>
  );
};

export default Actions;
