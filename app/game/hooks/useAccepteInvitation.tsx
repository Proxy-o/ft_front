import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation } from "@tanstack/react-query";
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
        }
        , 2000);
    }
    return gameId;
}


export default function useAcceptInvitation() {
    const mutation = useMutation({
        mutationFn: (invitationId: string) => {return accept(invitationId)},
        onSuccess: () => {
            // queryClient.invalidateQueries({ queryKey: ["invitations"] });
            // queryClient.invalidateQueries({ queryKey: ["game"] });
        }
    });
    return mutation;
}