import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
      queryClient.invalidateQueries({ queryKey: ["game"] });
    },
  });
  return mutation;
}
