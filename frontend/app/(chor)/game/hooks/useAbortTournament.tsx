import axiosInstance from "@/lib/functions/axiosInstance";
import useInvitationSocket from "@/app/(chor)/game/hooks/sockets/useInvitationSocket";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const aborttournament = async (tournamentId: string) => {
  try {
    const res = await axiosInstance.post("/game/abortTournament", {
      tournamentId: tournamentId,
    });
    if (res.status === 200) {
      toast.success(res.data.message);
    }
  } catch (error: any) {
    toast.error(error?.response?.data.error);
  }
  return tournamentId;
};

export default function useAborttournament() {
  const { handleRefetchTournament } = useInvitationSocket();
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: aborttournament,
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
