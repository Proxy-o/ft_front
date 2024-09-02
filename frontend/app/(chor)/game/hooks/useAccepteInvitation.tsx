import axiosInstance from "@/lib/functions/axiosInstance";
import useInvitationSocket from "@/app/(chor)/game/hooks/useInvitationSocket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function accept(invitationId: string) {
  let res;
  
    res = await axiosInstance.post("game/accept_invitation", {
      invitationId,
    });
  
  const gameId = res.data.gameId;
  return gameId;
}

export default function useAcceptInvitation() {
  const { handleRefetchPlayers } = useInvitationSocket();
  const query = useQueryClient();
  const mutation = useMutation({
    mutationFn: accept,
    onSuccess: (gameId) => {
      console.log("gameId", gameId);
      handleRefetchPlayers(gameId);
      query.invalidateQueries({ queryKey: ["game"] });
      query.invalidateQueries({ queryKey: ["gameFour"] });
      query.invalidateQueries({ queryKey: ["invitations"] });
    },
    onError: (error) => {

      query.invalidateQueries({ queryKey: ["invitations"] });
      console.log(toast.error(error?.response?.data.error));
    }
  });
  return mutation;
}
