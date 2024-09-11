import axiosInstance from "@/lib/functions/axiosInstance";
import useGameSocket from "@/app/(chor)/game/hooks/sockets/useGameSocket";
import useInvitationSocket from "@/app/(chor)/game/hooks/sockets/useInvitationSocket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const surrenderGame = async () => {
  try {
    const res = await axiosInstance.post("/game/surrender");
    console.log(res);
    if (res.status === 200) {
      const returnData = {
        gameId: res.data.gameId,
        tournamentId: res.data.tournamentId,
      };
      toast.success(res.data.message); // todo : refetch game when an enemy join tournament   done, to be tested
      return returnData;
    }
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
