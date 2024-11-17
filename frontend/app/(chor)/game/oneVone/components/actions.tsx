import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import useGameSocket from "../../hooks/sockets/useGameSocket";
import { DoorOpen, Flag, Gamepad } from "lucide-react";
import useSurrenderGame from "../../hooks/game/useSurrender";
import useLeaveGame from "../../hooks/game/useLeaveGame";
import { TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@/components/ui/tooltip";
import { User } from "@/lib/types";
import { toast } from "sonner";

const Actions = ({
  gameStarted,
  type,
  rightUserRef,
  leftUserRef,
  gameIdRef,
  state,
}: {
  gameStarted: boolean;
  type: string;
  rightUserRef: React.MutableRefObject<User | undefined>;
  leftUserRef: React.MutableRefObject<User | undefined>;
  gameIdRef: React.MutableRefObject<string>;
  state: React.MutableRefObject<string>;
}) => {
  const { handleStartGame } = useGameSocket();
  const { mutate: surrenderGame } = useSurrenderGame();
  const { mutate: leaveGame } = useLeaveGame({
    leftUserRef,
    rightUserRef,
    gameIdRef,
  });

  const startTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [startDisabled, setStartDisabled] = useState(false);
  const [leaveDisabled, setLeaveDisabled] = useState(false);
  const [surrenderDisabled, setSurrenderDisabled] = useState(false);

  const handleStart = () => {
    setStartDisabled(true); // Disable start button immediately

    if (startTimerRef.current) {
      clearTimeout(startTimerRef.current);
    }

    handleStartGame(
      leftUserRef.current?.username || "",
      rightUserRef.current?.username || "",
      gameIdRef.current
    );

    startTimerRef.current = setTimeout(() => {
      if (!gameStarted) {
        toast.error("Game failed to start. Leaving game...");
        leaveGame();
        setStartDisabled(false); // Re-enable button if game fails to start
      }
    }, 2000);
  };

  const handleLeave = () => {
    setLeaveDisabled(true);
    leaveGame();
  };

  const handleSurrender = () => {
    setSurrenderDisabled(true);
    surrenderGame(gameIdRef.current);
    state.current = "surrender";
  };

  // Cleanup timer when component unmounts or game starts
  useEffect(() => {
    if (gameStarted && startTimerRef.current) {
      clearTimeout(startTimerRef.current);
    }
    return () => {
      if (startTimerRef.current) {
        clearTimeout(startTimerRef.current);
      }
    };
  }, [gameStarted]);

  return (
    <div className="w-full h-fit absolute bottom-4 items-center justify-center flex">
      {rightUserRef.current?.username &&
        (!gameStarted ? (
          <div className="w-1/2 flex flex-row justify-between items-center gap-4">
            <TooltipProvider delayDuration={0}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleStart}
                    className="h-fit w-fit bg-green-600/40 disabled:opacity-50"
                    disabled={startDisabled}
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
                    onClick={handleLeave}
                    className="h-fit w-fit bg-yellow-600/40 disabled:opacity-50"
                    disabled={leaveDisabled}
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
                  onClick={handleSurrender}
                  className="h-fit w-fit bg-red-600/40 disabled:opacity-50"
                  disabled={surrenderDisabled}
                >
                  <Flag size={25} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Surrender</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
    </div>
  );
};

export default Actions;