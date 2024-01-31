import axiosInstance from "@/lib/functions/axiosInstance";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

async function unblock(to_unblock_id: string) {
  const response = await axiosInstance.post(`friends/unblock/${to_unblock_id}`);
  console.log("dd", response);
  return response.data;
}

export default function useUnBlock() {
  const queryClient = useQueryClient();
  queryClient.invalidateQueries({
    queryKey: [`friends`],
  });
  const mutation = useMutation({
    mutationFn: (to_unblock_id: string) => unblock(to_unblock_id),
    onSuccess: () => {
      toast.success("unblocked successfully");
    },
    onError: (err) => {
      console.log(err);
      toast.error("Something went wrong");
    },
  });
  return mutation;
}
