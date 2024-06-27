import axiosInstance from "@/lib/functions/axiosInstance";
import useGameSocket from "@/lib/hooks/useGameSocket";
import useInvitationSocket from "@/lib/hooks/useInvitationSocket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const surrenderGame = async () => {
  try {
    const res = await axiosInstance.post("/game/surrender");
    console.log(res);
    if (res.status === 204)
      toast.warning("your opponent has already surrendered");
    else toast.warning("You have surrendered");
  } catch (error) {
    console.log(error);
  }
};

export default function useSurrenderGame() {
  const { handleSurrenderFour } = useGameSocket();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => surrenderGame(),
    onSuccess: () => {
      handleSurrenderFour();
      queryClient.invalidateQueries({ queryKey: ["game"] });
    },
  });
  return mutation;
}
