import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function decline(invitationId: string) {
  // remove invitation from db
  const res = await axiosInstance.post("game/decline_invitation", {
    invitationId,
  });
  if (res.status === 200) {
    toast.success("Invitation declined");
  }
}

export default function useDeclineInvitation() {
  const queryClient = useQueryClient();
  const declineMutation = useMutation({
    mutationFn: decline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });
  return declineMutation;
}
