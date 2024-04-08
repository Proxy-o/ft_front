import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

async function accept(invitationId: string) {
  const res = await axiosInstance.post("game/accept_invitation_four", {
    invitationId,
  });
  const gameId = res.data.gameId;
  if (res.status === 200) {
    toast.success("Invitation accepted");
  }
  return gameId;
}

export default function useAcceptInvitation({
  setTab,
}: {
  setTab: Dispatch<SetStateAction<string>>;
}) {
  const mutation = useMutation({
    mutationFn: accept,
    onSuccess: () => {
      setTab("online");
    },
  });
  return mutation;
}
