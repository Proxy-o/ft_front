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
      user_id,
      friend,
      to_accept_id,
    }: {
      user_id: string;
      friend: User;
      to_accept_id: string;
    }) => acceptFriend(to_accept_id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(
        {
          queryKey: ["requests"],
        }
        
      );
  
      toast.success("Friend request accepted");
    },
    onError: (err) => {
      toast.error("Something went wrong");
    },
  });
  return mutation;
}
