import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function CreateTournement(userId: string) {
  const res = await axiosInstance.post("game/createTournament", {
    userId,
  });
}

export default function useCreateTournement(userId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: CreateTournement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournement", userId] });
    },
  });
  return mutation;
}
