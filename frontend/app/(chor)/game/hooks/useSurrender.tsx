import axiosInstance from "@/lib/functions/axiosInstance";
import useGameSocket from "@/app/(chor)/game/hooks/useGameSocket";
import useInvitationSocket from "@/app/(chor)/game/hooks/useInvitationSocket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const surrenderGame = async () => {
  try {
    const res = await axiosInstance.post("/game/surrender");
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

export default function useSurrenderGame() {
  const { handleSurrenderFour } = useGameSocket();
  const { handleRefetchTournament } = useInvitationSocket();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => surrenderGame(),
    onSuccess: (data) => {
      handleSurrenderFour(data?.gameId);

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
