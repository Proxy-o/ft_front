import getCookie from "@/lib/functions/getCookie";
import useSurrenderGame from "../hooks/useSurrender";
import useLeaveGame from "../hooks/useLeaveGame";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import useInvitationSocket from "@/lib/hooks/useInvitationSocket";
import useGetUser from "../../profile/hooks/useGetUser";

const Actions = ({
  gameStartedRef,
  type,
  userLeftTop,
  userRightTop,
  userLeftBottom,
  userRightBottom,
  gameId,
}: {
  gameStartedRef: React.MutableRefObject<boolean>;
  type: string;
  userLeftTop: string;
  userRightTop: string;
  userLeftBottom: string;
  userRightBottom: string;
  gameId: string;
}) => {
  const user_id = getCookie("user_id") || "";
  const { data: user } = useGetUser(user_id || "0");
  const username: string = user?.username || "";
  const isEnemyReadyRef = useRef(false);
  const { mutate: surrenderGame } = useSurrenderGame();
  const { mutate: leaveGame } = useLeaveGame();
  const { handleSurrender, handleSurrenderFour, handleRefetchPlayers } =
    useInvitationSocket();

  return (
    <div className="w-full h-fit flex flex-col justify-center items-center">
      {type === "two" && (
        <>
          {gameStartedRef.current ? (
            <Button
              onClick={() => {
                surrenderGame();
                handleSurrender(userLeftTop, userRightTop, gameId);
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
      {type === "four" && (
        <div className="w-full h-fit flex flex-row justify-center items-center gap-4">
          {!gameStartedRef.current ? (
            <Button
              onClick={() => {
                leaveGame();
                handleRefetchPlayers(
                  userLeftTop,
                  userRightTop,
                  userLeftBottom,
                  userRightBottom
                );
              }}
              className="w-1/4 mt-4"
            >
              Leave Game
            </Button>
          ) : (
            <Button
              onClick={() => {
                surrenderGame();
                handleSurrenderFour();
              }}
              className="w-1/2 mt-4"
            >
              Surrender
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Actions;
