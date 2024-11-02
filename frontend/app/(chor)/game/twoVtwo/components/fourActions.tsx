import { Button } from "@/components/ui/button";
import { DoorOpen, Flag, Gamepad } from "lucide-react";
import useLeaveGame from "../../hooks/game/useLeaveGame";
import useSurrenderGame from "../../hooks/game/useSurrender";
import useGameSocket from "../../hooks/sockets/useGameSocket";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const FourActions = ({
  playerReadyRef,
  gameStarted,
  username,
  leftUserTop,
  leftUserBottom,
  rightUserBottom,
  rightUserTop,
  onGoingGame,
  handleRefetchPlayers,
}: {
  playerReadyRef: any;
  gameStarted: boolean;
  username: string;
  leftUserTop: any;
  leftUserBottom: any;
  rightUserBottom: any;
  rightUserTop: any;
  onGoingGame: any;
  handleRefetchPlayers: any;
}) => {
  const { mutate: surrenderGame } = useSurrenderGame();

  const { mutate: leaveGame } = useLeaveGame(undefined);

  const { handleStartGameFour } = useGameSocket();
  return (
    <div className="w-full h-fit absolute bottom-4 items-center justify-center flex">
      {!gameStarted ? (
        <div className="w-5/6 flex flex-row justify-between items-center gap-4">
          <TooltipProvider delayDuration={0}>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {
                    playerReadyRef.current = 0;

                    handleStartGameFour(
                      username,
                      leftUserTop.current?.username || "",
                      leftUserBottom.current?.username || "",
                      rightUserBottom.current?.username || "",
                      rightUserTop.current?.username || ""
                    );
                  }}
                  className="h-fit w-fit bg-green-600/40"
                >
                  <Gamepad size={25} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Start</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={0}>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {
                    leaveGame();
                    handleRefetchPlayers(onGoingGame.data?.game.id || "");
                  }}
                  className="h-fit w-fit bg-red-600/40"
                >
                  <DoorOpen size={25} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Leave</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ) : (
        <TooltipProvider delayDuration={0}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  surrenderGame(onGoingGame.data?.game.id || "");
                }}
                className="h-fit w-fit bg-red-600/40"
              >
                <Flag size={25} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Surrender</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default FourActions;
