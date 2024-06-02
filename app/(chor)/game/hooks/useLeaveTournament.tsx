import axiosInstance from "@/lib/functions/axiosInstance";
import useInvitationSocket from "@/lib/hooks/useInvitationSocket";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const leavetournament = async (tournamentId: string) => {
  try {
    const res = await axiosInstance.post("/game/leaveTournament", {
      tournamentId: tournamentId,
    });
  } catch (error) {
    console.log(error);
  }
  return tournamentId;
};

export default function useLeavetournament() {
  const { handleRefetchTournament } = useInvitationSocket();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: leavetournament,
    onSuccess: (tournamentId) => {
      queryClient.invalidateQueries({ queryKey: ["tournament"] });
      queryClient.invalidateQueries({ queryKey: ["gameTournament"] });
      handleRefetchTournament(tournamentId);
    },
  });
  return mutation;
}
