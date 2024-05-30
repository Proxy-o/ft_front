import axiosInstance from "@/lib/functions/axiosInstance";
import useInvitationSocket from "@/lib/hooks/useInvitationSocket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function accept(invitationId: string) {
  const res = await axiosInstance.post("game/accept_invitation_tournament", {
    invitationId,
  });
  const gameId = res.data.gameId;
  if (res.status === 200) {
    toast.success("Invitation accepted");
  }
  return gameId;
}

export default function useAcceptInvitationTournament() {
  const { handleAcceptInvitation } = useInvitationSocket();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: accept,
    onSuccess: (invitationId) => {
      queryClient.invalidateQueries({ queryKey: ["tournament"] });
      handleAcceptInvitation(invitationId);
    },
  });
  return mutation;
}
