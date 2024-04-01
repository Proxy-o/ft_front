import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

async function decline(invitationId: string) {
    // remove invitation from db
    const res = await axiosInstance.post("game/decline_invitation", {
        invitationId,
    });
    if (res.status === 200) {
        // remove invitation from state
        
    }
}


export default function useDeclineInvitation() {
    const declineMutation = useMutation({
        mutationFn: decline,
        onSuccess: () => {
            // queryClient.invalidateQueries({ queryKey: ["invitations"] });
            toast.warning("Invitation declined");
        }
    });
    return declineMutation;
}