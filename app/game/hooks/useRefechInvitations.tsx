import { useQueryClient } from "@tanstack/react-query";

export default function useRefechInvitations(userId: string) {
    const queryClient = useQueryClient();
    const refetchInvitations = () => {
        queryClient.invalidateQueries({ queryKey: ["invitations"] });
    }
    return refetchInvitations;
}