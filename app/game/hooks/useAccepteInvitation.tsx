import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";

async function accept(invitationId: string) {
  const res = await axiosInstance.post("game/accept_invitation", {
    invitationId,
  });
  const gameId = res.data.gameId;
  if (res.status === 200) {
    toast.success("Invitation accepted");
    setTimeout(() => {
      toast.info("You will be redirected to the game page");
    }, 2000);
  }
  return gameId;
}

export default function useAcceptInvitation({
  setTab,
}: {
  setTab: Dispatch<SetStateAction<string>>;
}) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (invitationId: string) => {
      return accept(invitationId);
    },
    onSuccess: () => {
      setTab("online");
    },
  });
  return mutation;
}
