import axiosInstance from "@/lib/functions/axiosInstance";

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
  queryClient.invalidateQueries({
    queryKey: [`friends`],
  });
  const mutation = useMutation({
    mutationFn: (to_accept_id: string) => acceptFriend(to_accept_id),
    onSuccess: () => {
      toast.success("Friend request accepted");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  return mutation;
}
