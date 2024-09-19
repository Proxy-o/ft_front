import axiosInstance from "@/lib/functions/axiosInstance";
import useInvitationSocket from "@/app/(chor)/game/hooks/sockets/useInvitationSocket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const leavetournament = async (tournamentId: string) => {
  try {
    const res = await axiosInstance.post("/game/leaveTournament", {
      tournamentId: tournamentId,
    });
    if (res !== res) throw new Error("Failed to leave tournament");
  } catch (error: any) {
    toast.error(error?.response?.data.error);
  }
  return tournamentId;
};

export default function useLeavetournament() {
  const { handleRefetchTournament } = useInvitationSocket();
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: leavetournament,
    onSuccess: (tournamentId) => {
      handleRefetchTournament(tournamentId);
      queryClient.invalidateQueries({ queryKey: ["tournament"] });
      queryClient.invalidateQueries({ queryKey: ["game"] });
      toast.success("You have left the tournament");
      router.push("/game/tournament");
    },
  });
  return mutation;
}
