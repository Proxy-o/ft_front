import axiosInstance from "@/lib/functions/axiosInstance";
import useGameSocket from "@/app/(chor)/game/hooks/sockets/useGameSocket";
import useInvitationSocket from "@/app/(chor)/game/hooks/sockets/useInvitationSocket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const surrenderGame = async (gameId: string) => {
  try {
    const res = await axiosInstance.post("/game/surrender", { gameId });
    // console.log(res);
    if (res.status === 200) {
      const returnData = {
        gameId: res.data.gameId,
        tournamentId: res.data.tournamentId,
      };
      // console.log("tournament surrender",res.data);
      toast.success(res.data.message);
      return returnData;
    }
  } catch (error: any) {
    toast.error(error?.response?.data.error);
  }
  return null;
};

export default function useSurrenderGame() {
  const { handleSurrenderFour, handleSurrender } = useGameSocket();
  const { handleRefetchTournament, handleRefetchPlayers } =
    useInvitationSocket();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: surrenderGame,
    onSuccess: (data) => {
      handleRefetchPlayers(data?.gameId);
      handleSurrender(data?.gameId);
      console.log(data);

      handleSurrenderFour(data?.gameId);
      // console.log(data);
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
