import getCookie from "@/lib/functions/getCookie";
import useGetGame from "../hooks/useGetGames";
import useSurrenderGame from "../hooks/useSurrender";
import useLeaveGame from "../hooks/useLeaveGame";
import useGameSocket from "@/lib/hooks/useGameSocket";
import { Button } from "@/components/ui/button";
import useGetUser from "@/app/profile/hooks/useGetUser";
import { toast } from "sonner";
import { useRef } from "react";

const Actions = ({
  gameStarted,
  type,
}: {
  gameStarted: boolean;
  type: string;
}) => {
  const user_id = getCookie("user_id") || "";
  const { data: user } = useGetUser(user_id || "0");
  const username: string = user?.username || "";
  const isEnemyReadyRef = useRef(false);
  const { mutate: surrenderGame } = useSurrenderGame();
  const { mutate: leaveGame } = useLeaveGame();
  const {
    handleSurrender,
    handleSurrenderFour,
    handleStartGameFour,
    handleRefetchPlayers,
  } = useGameSocket();
  const { onGoingGame } = useGetGame(user_id || "0", type);

  return (
    <div className="w-full h-fit flex flex-col justify-center items-center">
      {onGoingGame.isSuccess &&
        onGoingGame.data.game.user1 &&
        type === "two" && (
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
      {onGoingGame.isSuccess && !gameStarted && type === "four" && (
        <div className="w-full h-fit flex flex-row justify-center items-center gap-4">
          <Button
            onClick={async () => {
              handleStartGameFour(
                username,
                onGoingGame.data?.game?.user1.username || "",
                onGoingGame.data?.game?.user2.username || "",
                onGoingGame.data?.game?.user3.username || "",
                onGoingGame.data?.game?.user4.username || ""
              );
              setTimeout(() => {
                if (!isEnemyReadyRef.current) {
                  toast.error("The enemy is not ready");
                }
              }, 1000);
            }}
            className="w-1/4 mt-4"
          >
            Start Game
          </Button>
          <Button
            onClick={() => {
              leaveGame();
              handleRefetchPlayers();
            }}
            className="w-1/4 mt-4"
          >
            Leave Game
          </Button>
        </div>
      )}
      {onGoingGame.isSuccess && gameStarted && (
        <Button
          onClick={() => {
            surrenderGame();
            handleSurrenderFour(
              username,
              onGoingGame.data?.game?.user1.username || "",
              onGoingGame.data?.game?.user2.username || "",
              onGoingGame.data?.game?.user3.username || "",
              onGoingGame.data?.game?.user4.username || "",
              username === onGoingGame.data?.game?.user4.username ||
                username === onGoingGame.data?.game?.user2.usernamez
                ? "left"
                : "right",
              onGoingGame.data?.game?.id || ""
            );
          }}
          className="w-1/2 mt-4"
        >
          Surrender
        </Button>
      )}
    </div>
  );
};

export default Actions;
