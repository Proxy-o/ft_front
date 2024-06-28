import axiosInstance from "@/lib/functions/axiosInstance";
import useInvitationSocket from "@/lib/hooks/useInvitationSocket";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deleteTournament = async (tournamentId: string) => {
  try {
    console.log(tournamentId);
    const res = await axiosInstance.post("/game/deleteTournament", {
      tournamentId: tournamentId,
    });
  } catch (error) {
    console.log(error);
  }
  return tournamentId;
};

export default function useDeletetournament() {
  const { handleRefetchTournament } = useInvitationSocket();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteTournament,
    onSuccess: (tournamentId) => {
      queryClient.invalidateQueries({ queryKey: ["tournament"] });
      queryClient.invalidateQueries({ queryKey: ["gameTournament"] });
      handleRefetchTournament(tournamentId);
    },
  });
  return mutation;
}