import axiosInstance from "@/lib/functions/axiosInstance";
import useInvitationSocket from "@/lib/hooks/useInvitationSocket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function decline(invitationId: string) {
  // remove invitation from db
  try {
    const res = await axiosInstance.post("game/decline_invitation", {
      invitationId,
    });
    if (res.status === 200) {
      toast.success(res.data.message);
    }
  } catch (error: any) {
    toast.error(error?.response?.data.error);
  }
  return invitationId;
}

export default function useDeclineInvitation() {
  const { handleInvitationDecline } = useInvitationSocket();
  const queryClient = useQueryClient();
  const declineMutation = useMutation({
    mutationFn: decline,
    onSuccess: (invitationId) => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      handleInvitationDecline(invitationId);
    },
  });
  return declineMutation;
}
