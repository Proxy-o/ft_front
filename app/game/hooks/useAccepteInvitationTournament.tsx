import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

async function accept(invitationId: string) {
  console.log("accepting invitation");
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
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: accept,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournament"] });
    },
  });
  return mutation;
}
