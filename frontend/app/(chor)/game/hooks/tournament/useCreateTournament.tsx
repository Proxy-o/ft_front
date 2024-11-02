import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

async function CreateTournament(userId: string) {
let res;
  try {

    res = await axiosInstance.post("game/createTournament", {
      userId,
    });
    if (res.status === 200) {
      toast.success(res.data.message);
    }
  } catch (error: any) {
    toast.error(error?.response?.data.error);
  }
}

export default function useCreateTournament(userId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: CreateTournament,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournament"] });
    },
  });
  return mutation;
}
