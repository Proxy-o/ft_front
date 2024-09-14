import axiosInstance from "@/lib/functions/axiosInstance";
import useInvitationSocket from "@/app/(chor)/game/hooks/sockets/useInvitationSocket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useGameSocket from "./sockets/useGameSocket";

const endGame = async (data: {
  winner: string;
  winnerScore: number;
  loser: string;
  loserScore: number;
}) => {
  try {
    const { winner, winnerScore, loser, loserScore } = data;
    const res = await axiosInstance.post("/game/endGame", {
      winner,
      winnerScore,
      loser,
      loserScore,
    });
    if (res.data.tournamentId) {
      return res.data.tournamentId;
    }
  } catch (error: any) {
    toast.error(error.response.data.error);
  }
  return null;
};

export default function useEndGame() {
  const { handleRefetchTournament } = useInvitationSocket();
  const { handleEndGame } = useGameSocket();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: {
      winner: string;
      winnerScore: number;
      loser: string;
      loserScore: number;
    }) => endGame(data),
    onSuccess: (tournamentId) => {
      queryClient.invalidateQueries({ queryKey: ["game"] });
      queryClient.invalidateQueries({ queryKey: ["tournament"] });
      queryClient.invalidateQueries({ queryKey: ["tournamentGame"] });
      handleEndGame();

      if (tournamentId) {
        console.log("tournamentId", tournamentId);
        handleRefetchTournament(tournamentId);
      }
    },
  });
  return mutation;
}
``;
