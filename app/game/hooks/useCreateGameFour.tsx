import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function CreateGameFour(userId: string) {
  const res = await axiosInstance.post("game/createGameFour", {
    userId,
  });
  const gameId = res.data.gameId;
  if (res.status === 200) {
    toast.success("Invitation accepted");
  }
  return gameId;
}

export default function useCreateGameFour(userId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: CreateGameFour,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gameFour", userId] });
    },
  });
  return mutation;
}
