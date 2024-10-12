import axiosInstance from "@/lib/functions/axiosInstance";
import useInvitationSocket from "@/app/(chor)/game/hooks/sockets/useInvitationSocket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const startTournament = async (tournamentId: string) => {
    let res;
  try {
    res = await axiosInstance.post("/game/start_tournament", {
      tournamentId,
    });

    // console.log(res);
    if (res.data.tournamentId) {
        return res.data.tournamentId;
    }
} catch (error: any) {
      // console.log(res.data);
    toast.error(error.response.data.error);
  }
  return null;
};

export default function useStartTournament(tournamentId: string) {
  const { handleStartTournament } = useInvitationSocket();
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: startTournament,
    onSuccess: (tournamentId) => {
      queryClient.invalidateQueries({ queryKey: ["game"] });
      queryClient.invalidateQueries({ queryKey: ["tournament"] });
      queryClient.invalidateQueries({ queryKey: ["tournamentGame"] });

      if (tournamentId) {
        handleStartTournament(tournamentId);
        router.push(`/game/tournament/${tournamentId}`);
      }
    },
  });
  return mutation;
}
``;
