import { Button } from "@/components/ui/button";
import { DoorOpen, Flag, Gamepad } from "lucide-react";
import useLeaveGame from "../../hooks/useLeaveGame";
import useSurrenderGame from "../../hooks/useSurrender";
import useGameSocket from "../../hooks/sockets/useGameSocket";

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
    <>
      {!gameStarted ? (
        <div className="w-full flex flex-row justify-center items-center gap-4">
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
            className="h-full w-full"
          >
            <Gamepad size={25} />
          </Button>
          <Button
            onClick={() => {
              leaveGame();
              handleRefetchPlayers(onGoingGame.data?.game.id || "");
            }}
            className="h-full w-full"
          >
            <DoorOpen size={25} />
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => {
            surrenderGame();
            handleRefetchPlayers(onGoingGame.data?.game.id || "");
          }}
          className="h-full w-full"
        >
          <Flag size={25} />
          Surrender
        </Button>
      )}
    </>
  );
};

export default FourActions;
