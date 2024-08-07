import axiosInstance from "@/lib/functions/axiosInstance";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

async function reject(to_reject_id: string | null) {
  if (!to_reject_id) {
    throw new Error("Invalid user id");
  }
  const response = await axiosInstance.post(
    `/friend_request/delete/${to_reject_id}`
  );
  return response.data;
}

export default function useReject() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (to_reject_id: string | null) => reject(to_reject_id),
    onSuccess: (_, to_reject_id) => {
      queryClient.invalidateQueries({
        queryKey: ["requests"],
      });
      toast.success("rejected successfully");
    },
    onError: () => {
      toast.error("You cannot Decline this friend request");
    },
  });
  return mutation;
}
