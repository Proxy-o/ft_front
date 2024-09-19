import axiosInstance from "@/lib/functions/axiosInstance";
import getCookie from "@/lib/functions/getCookie";
import { User } from "@/lib/types";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import useWebSocket from "react-use-websocket";

import { toast } from "sonner";

async function reject(to_reject_id: string | null) {
  console.log("to_reject_id", to_reject_id);
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
  const token = getCookie("refresh");
  const socketUrl = process.env.NEXT_PUBLIC_CHAT_URL + "2/?refresh=" + token;
  const { sendJsonMessage, lastMessage, lastJsonMessage } = useWebSocket(
    socketUrl,
    {
      share: true,
    }
  );

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
