import axiosInstance from "@/lib/functions/axiosInstance";
import { User } from "@/lib/types";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

async function block(to_block_id: string) {
  console.log(to_block_id);
  const response = await axiosInstance.post(`friends/block/${to_block_id}`);
  return response.data;
}

export default function useBlock() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ to_block, user_id }: { to_block: User; user_id: string }) =>
      block(to_block.id),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(["friends", variables.user_id], (old: any) => {
        if (!old) return [variables.to_block];
        return old.filter((el: any) => el.id !== variables.to_block.id);
      });
      queryClient.setQueryData(["blocked"], (old: any) => {
        if (!old) return [variables.to_block];
        return [...old, variables.to_block];
      });
      queryClient.setQueryData(["requests"], (old: any) => {
        return old.filter(
          (el: any) => el.from_user.id !== variables.to_block.id
        );
      });

      toast.success("blocked successfully");
    },
    onError: (err) => {
      console.log(err);
      toast.error("Something went wrong");
    },
  });
  return mutation;
}
