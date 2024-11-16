import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
    },
  });
  return mutation;
}
``;
