import axiosInstance from "@/lib/functions/axiosInstance";

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
  queryClient.invalidateQueries({
    queryKey: [`friends`],
  });
  const mutation = useMutation({
    mutationFn: (to_unfriend_id: string) => unfriend(to_unfriend_id),
    onSuccess: () => {
      toast.success("Friend request accepted");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  return mutation;
}
