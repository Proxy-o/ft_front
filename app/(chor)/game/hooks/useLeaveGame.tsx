import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const leaveGame = async () => {
  try {
    const res = await axiosInstance.post("/game/leaveGame");
  } catch (error) {
    console.log(error);
  }
};

export default function useLeaveGame() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => leaveGame(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gameFour"] });
      queryClient.invalidateQueries({ queryKey: ["game"] });
    },
  });
  return mutation;
}
