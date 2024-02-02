import axiosInstance from "@/lib/functions/axiosInstance";
import { User } from "@/lib/types";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

async function acceptFriend(to_accept_id: string) {
  const response = await axiosInstance.post(
    `/friend_request/accept/${to_accept_id}`
  );
  return response.data;
}

export default function useAcceptFriend() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      friend,
      to_accept_id,
    }: {
      friend: User;
      to_accept_id: string;
    }) => acceptFriend(to_accept_id),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(["requests"], (old: any) => {
        return old.filter((el: any) => el.id !== variables.to_accept_id);
      });
      queryClient.setQueryData(["friends"], (old: any) => {
        if (!old) return [variables.friend];
        return [...old, variables.friend];
      });
      toast.success("Friend request accepted");
    },
    onError: (err) => {
      console.log(err);
      toast.error("Something went wrong");
    },
  });
  return mutation;
}
