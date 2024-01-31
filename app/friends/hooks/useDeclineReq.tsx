import axiosInstance from "@/lib/functions/axiosInstance";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

async function reject(to_reject_id: string) {
  const response = await axiosInstance.post(
    `/friend_request/delete/${to_reject_id}`
  );
  return response.data;
}

export default function useReject() {
  const queryClient = useQueryClient();
  queryClient.invalidateQueries({
    queryKey: [`friends`],
  });
  const mutation = useMutation({
    mutationFn: (to_reject_id: string) => reject(to_reject_id),
    onSuccess: () => {
      toast.success("rejected successfully");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  return mutation;
}
