import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


const getInvitations = async () => {
    const response = await axiosInstance.get(`/game/invitations`);
    return response.data;
}

async function accept(invitationId: string) {
    const res = await axiosInstance.post("game/accept_invitation", {
        invitationId,
    });
    if (res.status === 200) {
        toast.success("Invitation accepted");
        setTimeout(() => {
            toast.info("You will be redirected to the game page");
        }
        , 2000);
    }
}

async function decline(invitationId: string) {
    // remove invitation from db
    const res = await axiosInstance.post("game/decline_invitation", {
        invitationId,
    });
    if (res.status === 200) {
        // remove invitation from state
        
    }
}

export default function useGetInvitations(userId: string) {
    const queryClient = useQueryClient();
    const { data } = useQuery({
            queryKey: ["invitations", userId],
            queryFn: () => getInvitations(),
        },
    );
    const { mutateAsync: acceptMutation } = useMutation({
        mutationFn: accept,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invitations"] });
        }
    });

    const { mutateAsync: declineMutation } = useMutation({
        mutationFn: decline,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invitations"] });
            toast.warning("Invitation declined");
        }
    });
    const refetch = () => {
        queryClient.invalidateQueries({ queryKey: ["invitations"] });
    }
    return { data, acceptMutation, declineMutation, refetch };
}
