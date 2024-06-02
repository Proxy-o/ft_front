import axiosInstance from "@/lib/functions/axiosInstance";
import useInvitationSocket from "@/lib/hooks/useInvitationSocket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function accept(invitationId: string) {
  const res = await axiosInstance.post("game/accept_invitation_tournament", {
    invitationId,
  });
  const tournamentId = res.data.tournamentId;
  if (res.status === 200) {
    toast.success("Invitation accepted");
  }
  return tournamentId;
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
