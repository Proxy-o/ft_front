import axiosInstance from "@/lib/functions/axiosInstance";
import useGameSocket from "@/app/(chor)/game/hooks/sockets/useGameSocket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const surrenderGame = async (gameId: string) => {
  try {
    const res = await axiosInstance.post("/game/surrender", { gameId });
    // console.log(res);
    if (res.status === 200) {
      const returnData = {
        gameId: res.data.gameId,
        type: res.data.type,
      };
      // console.log("tournament surrender",res.data);
      toast.success(res.data.message);
      return returnData;
    }
  } catch (error: any) {
    toast.error(error?.response?.data.error);
  }
  return null;
};

export default function useSurrenderGame() {
  const { handleSurrenderFour, handleSurrender } = useGameSocket();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: surrenderGame,
    onSuccess: (data) => {
      // alert("surrendered " + data?.type);
      // handleRefetchPlayers(data?.gameId);
      if (data?.type === "four") {
        handleSurrenderFour(data?.gameId);
      } else if (data?.type === "two") {
        handleSurrender(data?.gameId);
      }
  
      queryClient.invalidateQueries({ queryKey: ["game"] });
      queryClient.invalidateQueries({ queryKey: ["gameFour"] });
    },
  });
  return mutation;
}
