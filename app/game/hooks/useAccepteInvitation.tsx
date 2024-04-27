import axiosInstance from "@/lib/functions/axiosInstance";
import useGameSocket from "@/lib/hooks/useGameSocket";
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
  const mutation = useMutation({
    mutationFn: accept,
  });
  return mutation;
}
