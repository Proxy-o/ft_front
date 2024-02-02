import axiosInstance from "@/lib/functions/axiosInstance";
import { User } from "@/lib/types";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

async function unfriend(to_unfriend_id: string) {
  const response = await axiosInstance.post(
    `/friends/remove/${to_unfriend_id}`
  );
  return response.data;
}

export default function useUnfriend() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      to_unfriend,
      user_id,
    }: {
      to_unfriend: User;
      user_id: string;
    }) => unfriend(to_unfriend.id),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(
        ["friends", variables.user_id.toString()],
        (old: any) => {
          return old.filter((el: any) => el.id !== variables.to_unfriend.id);
        }
      );
      queryClient.setQueryData(
        ["friends", variables.to_unfriend.id.toString()],
        (old: any) => {
          return old.filter((el: any) => el.id !== variables.user_id);
        }
      );
      toast.success("Unfriended successfully");
    },
    onError: (err) => {
      console.log(err);
      toast.error("Something went wrong");
    },
  });
  return mutation;
}
