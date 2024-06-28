import axiosInstance from "@/lib/functions/axiosInstance";
import useInvitationSocket from "@/lib/hooks/useInvitationSocket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function accept(invitationId: string) {
  const res = await axiosInstance.post("game/accept_invitation", {
    invitationId,
  });
  const gameId = res.data.gameId;
  if (res.status === 200) {
    toast.success("Invitation accepted");
  }
  return gameId;
}

export default function useAcceptInvitation() {
  const { handleRefetchPlayers } = useInvitationSocket();
  const query = useQueryClient();
  const mutation = useMutation({
    mutationFn: accept,
    onSuccess: (gameId) => {
      handleRefetchPlayers(gameId);
      query.invalidateQueries({ queryKey: ["game"] });
      query.invalidateQueries({ queryKey: ["gameFour"] });
      query.invalidateQueries({ queryKey: ["invitations"] });
    },
  });
  return mutation;
}
