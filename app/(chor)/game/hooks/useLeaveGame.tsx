import axiosInstance from "@/lib/functions/axiosInstance";
import useGameSocket from "@/lib/hooks/useGameSocket";
import useInvitationSocket from "@/lib/hooks/useInvitationSocket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const leaveGame = async () => {
  try {
    const res = await axiosInstance.post("/game/leaveGame");
    console.log(res);
    if (res.status === 200) {
      const returnData = {
        gameId: res.data.gameId,
        tournamentId: res.data.tournamentId,
      };
      return returnData;
    } else if (res.status === 204) {
      toast.error("You are not in a game");
    }
  } catch (error) {
    console.log(error);
  }
  return null;
};

export default function useLeaveGame() {
  const { handleSurrenderFour } = useGameSocket();
  const { handleRefetchTournament } = useInvitationSocket();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => leaveGame(),
    onSuccess: (data) => {
      handleSurrenderFour(data?.gameId);

      if (data?.tournamentId) {
        handleRefetchTournament(data?.tournamentId);
      }
      queryClient.invalidateQueries({ queryKey: ["game"] });
      queryClient.invalidateQueries({ queryKey: ["gameFour"] });
      queryClient.invalidateQueries({ queryKey: ["tournament"] });
    },
    onError: (error) => {
      toast.error("Error leaving game");
    },
  });
  return mutation;
}
