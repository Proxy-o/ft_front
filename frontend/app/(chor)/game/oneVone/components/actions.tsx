import { Button } from "@/components/ui/button";
import { canvasParams } from "../../types";
import useGameSocket from "../../hooks/sockets/useGameSocket";
import { DoorOpen, Flag, Gamepad } from "lucide-react";
import useSurrenderGame from "../../hooks/useSurrender";
import useLeaveGame from "../../hooks/useLeaveGame";

const Actions = (
    {canvasPrams, gameStartedRef, type}: {canvasPrams: canvasParams, gameStartedRef: React.MutableRefObject<boolean>, type: string}
) => {
    const { handleStartGame, handleSurrender } = useGameSocket();
    const {mutate: surrenderGame} = useSurrenderGame();
    const {rightUserRef, leftUserRef, gameIdRef} = canvasPrams;
    const {mutate: leaveGame} = useLeaveGame({leftUserRef, rightUserRef, gameIdRef});


    return (
        rightUserRef.current?.username && (
            <div className="w-full md:w-5/6 h-[70px] max-w-[800px] flex justify-between items-center">
              {!gameStartedRef.current ? (
                <>
                  <div className="ml-[80px] h-5/6 w-1/6">
                    <Button
                      onClick={() => {
                        handleStartGame(
                          leftUserRef.current?.username || "",
                          rightUserRef.current?.username || "",
                          gameIdRef.current
                        );
                      }}
                      className="h-full w-full bg-primary"
                    >
                      <Gamepad size={25} />
                      Start
                    </Button>
                  </div>
                  {type !== "tournament" && (
                    <div className="mr-[80px] h-5/6 w-1/6">
                      <Button
                        onClick={() => {
                          leaveGame();
                        }}
                        className="h-full w-full bg-primary"
                      >
                        <DoorOpen size={25} />
                        Leave
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="ml-auto mr-[80px] h-5/6 w-1/6">
                  <Button
                    onClick={() => {
                      surrenderGame();
                      handleSurrender(
                        leftUserRef.current?.username || "",
                        rightUserRef.current?.username || "",
                        gameIdRef.current
                      );
                    }}
                    className="h-full w-full bg-primary"
                  >
                    <Flag size={25} />
                    Surrender
                  </Button>
                </div>
              )}
            </div>
          )
    )
}

export default Actions;