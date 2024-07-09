import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const endGameFour = async (data: {
  winner: string;
  winnerScore: number;
  loser: string;
  loserScore: number;
}) => {
  try {
    const { winner, winnerScore, loser, loserScore } = data;
    const res = await axiosInstance.post("/game/endGameFour", {
      winner,
      winnerScore,
      loser,
      loserScore,
    });
  } catch (error: any) {
    toast.error(error.response.data.error);
  }
};

export default function useEndGameFour() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: {
      winner: string;
      winnerScore: number;
      loser: string;
      loserScore: number;
    }) => endGameFour(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gameFour"] });
    },
  });
  return mutation;
}
