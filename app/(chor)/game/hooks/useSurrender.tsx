import axiosInstance from "@/lib/functions/axiosInstance";
import useGameSocket from "@/lib/hooks/useGameSocket";
import useInvitationSocket from "@/lib/hooks/useInvitationSocket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const surrenderGame = async () => {
  try {
    const res = await axiosInstance.post("/game/surrender");
    console.log(res.data.gameId);
    return res.data.gameId;
  } catch (error) {
    console.log(error);
  }
  return "";
};

export default function useSurrenderGame() {
  const { handleSurrenderFour } = useGameSocket();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => surrenderGame(),
    onSuccess: (gameId) => {
      handleSurrenderFour(gameId);
      queryClient.invalidateQueries({ queryKey: ["game"] });
    },
  });
  return mutation;
}
