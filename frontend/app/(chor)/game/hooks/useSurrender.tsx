import axiosInstance from "@/lib/functions/axiosInstance";
import useGameSocket from "@/lib/hooks/useGameSocket";
import useInvitationSocket from "@/lib/hooks/useInvitationSocket";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const surrenderGame = async () => {
  try {
    const res = await axiosInstance.post("/game/surrender");
    const returnData = {
      gameId: res.data.gameId,
      tournamentId: res.data.tournamentId,
    };
    return returnData;
  } catch (error) {
    console.log(error);
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
