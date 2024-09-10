import axiosInstance from "@/lib/functions/axiosInstance";
import useInvitationSocket from "@/app/(chor)/game/hooks/sockets/useInvitationSocket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function accept(invitationId: string) {
  try {
    const res = await axiosInstance.post("game/accept_invitation_tournament", {
      invitationId,
    });
    const tournamentId = res.data.tournamentId;
    toast.success(res.data.message);
    return tournamentId;
  } catch (error: any) {
    toast.error(error?.response?.data.error);
  }
}

export default function useAcceptInvitationTournament() {
  const { handleAcceptTournamentInvitation } = useInvitationSocket();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: accept,
    onSuccess: (tournamentId) => {
      queryClient.invalidateQueries({ queryKey: ["tournament"] });
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      handleAcceptTournamentInvitation(tournamentId);
    },
  });
  return mutation;
}
