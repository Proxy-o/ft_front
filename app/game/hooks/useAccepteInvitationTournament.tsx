import axiosInstance from "@/lib/functions/axiosInstance";
import useGameSocket from "@/lib/hooks/useGameSocket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
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
  const { handleAcceptInvitation } = useGameSocket();
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
