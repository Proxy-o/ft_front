import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function CreateTournament(userId: string) {
  const res = await axiosInstance.post("game/createTournament", {
    userId,
  });
  return res.data;
}

export default function useCreateTournament(userId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: CreateTournament,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournament", userId] });
    },
  });
  // todo handle create tournament logic
  return mutation;
}
