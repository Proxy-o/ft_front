import axiosInstance from "@/lib/functions/axiosInstance";
import { User } from "@/lib/types";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import useChatSocket from "../../game/hooks/sockets/useChatSocket";

async function reject(to_reject_id: string | null) {
  // console.log("to_reject_id", to_reject_id);
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
  const {sendJsonMessage} = useChatSocket()


  const mutation = useMutation({
    mutationFn: ({
      to_reject_id,
      friend,
    }: {
      to_reject_id: string;
      friend: User;
    }) => reject(to_reject_id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["requests"],
      });
      sendJsonMessage({ message: `/friendUpdate ${variables.friend.id}` });

      toast.success("rejected successfully");
    },
    onError: () => {
      toast.error("You cannot Decline this friend request");
    },
  });
  return mutation;
}
