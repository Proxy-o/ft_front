import axiosInstance from "@/lib/functions/axiosInstance";
import useGameSocket from "@/app/(chor)/game/hooks/sockets/useGameSocket";
import useInvitationSocket from "@/app/(chor)/game/hooks/sockets/useInvitationSocket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const leaveGame = async () => {
  try {
    const res = await axiosInstance.post("/game/leaveGame");
    const returnData = {
      gameId: res.data.gameId,
      tournamentId: res.data.tournamentId,
    };
    return returnData;
  } catch (error: any) {
    toast.error(error?.response?.data.error);
  }
  return null;
};

export default function useLeaveGame(
  props:
    | {
        leftUserRef: React.MutableRefObject<any>;
        rightUserRef: React.MutableRefObject<any>;
        gameIdRef: React.MutableRefObject<any>;
      }
    | undefined
) {
  const { leftUserRef, rightUserRef, gameIdRef } = props || {};
  // const { handleSurrender, handleSurrenderFour } = useGameSocket();
  const { handleRefetchTournament, handleLeaveGame } = useInvitationSocket();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: leaveGame,
    onSuccess: (data) => {
      handleLeaveGame(leftUserRef?.current.username, rightUserRef?.current.username);
      // if (leftUserRef && rightUserRef && gameIdRef)
      //   handleSurrender(gameIdRef.current);
      if (data?.tournamentId) {
        handleRefetchTournament(data?.tournamentId);
      }
      queryClient.invalidateQueries({ queryKey: ["game"] });
      queryClient.invalidateQueries({ queryKey: ["gameFour"] });
      queryClient.invalidateQueries({ queryKey: ["tournament"] });
    },
  });
  return mutation;
}
