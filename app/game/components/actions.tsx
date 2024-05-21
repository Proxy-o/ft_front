import getCookie from "@/lib/functions/getCookie";
import useGetGame from "../hooks/useGetGames";
import useSurrenderGame from "../hooks/useSurrender";
import useLeaveGame from "../hooks/useLeaveGame";
import useGameSocket from "@/lib/hooks/useGameSocket";
import { Button } from "@/components/ui/button";

const Actions = ({ gameStarted }: { gameStarted: boolean }) => {
  const user_id = getCookie("user_id") || "";
  const { mutate: surrenderGame } = useSurrenderGame();
  const { mutate: leaveGame } = useLeaveGame();
  const { handleSurrender } = useGameSocket();
  const type = "two";
  const { onGoingGame } = useGetGame(user_id || "0", type);

  return (
    <div className="w-full h-fit flex flex-col justify-center items-center">
      {onGoingGame.isSuccess && onGoingGame.data.game.user1 && (
        <>
          {gameStarted ? (
            <Button
              onClick={() => {
                surrenderGame();
                handleSurrender(
                  onGoingGame.data?.game?.user1.username || "",
                  onGoingGame.data?.game?.user2.username || "",
                  onGoingGame.data?.game?.id || ""
                );
              }}
              className="w-1/2 mt-4"
            >
              Surrender
            </Button>
          ) : (
            <Button
              onClick={() => {
                leaveGame();
              }}
              className="w-1/4 mt-4"
            >
              Leave Game
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default Actions;
