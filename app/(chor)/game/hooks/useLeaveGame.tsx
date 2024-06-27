import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const leaveGame = async () => {
  try {
    const res = await axiosInstance.post("/game/leaveGame");
    console.log(res);
    if (res.status === 200) {
      return res.data;
    } else if (res.status === 204) {
      toast.error("You are not in a game");
    }
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
    onError: (error) => {
      toast.error("Error leaving game");
    },
  });
  return mutation;
}
