import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function startTournament(userId: string) {
  const res = await axiosInstance.post("game/start_tournament", {
    userId,
  });
}

export default function useStartTournament(userId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: startTournament,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournament", userId] });
    },
  });
  return mutation;
}
