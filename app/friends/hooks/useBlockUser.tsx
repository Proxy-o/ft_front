import axiosInstance from "@/lib/functions/axiosInstance";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

async function block(to_block_id: string) {
  console.log(to_block_id);
  const response = await axiosInstance.post(`friends/block/${to_block_id}`);
  return response.data;
}

export default function useBlock() {
  const queryClient = useQueryClient();
  queryClient.invalidateQueries({
    queryKey: [`friends`],
  });
  const mutation = useMutation({
    mutationFn: (to_block_id: string) => block(to_block_id),
    onSuccess: () => {
      toast.success("blocked successfully");
    },
    onError: (err) => {
      console.log(err);
      toast.error("Something went wrong");
    },
  });
  return mutation;
}
