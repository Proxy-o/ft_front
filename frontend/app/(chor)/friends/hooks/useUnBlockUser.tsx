import axiosInstance from "@/lib/functions/axiosInstance";
import getCookie from "@/lib/functions/getCookie";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import useWebSocket from "react-use-websocket";

import { toast } from "sonner";

async function unblock(to_unblock_id: string) {
  const response = await axiosInstance.post(`friends/unblock/${to_unblock_id}`);
  return response.data;
}

export default function useUnBlock() {
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
    mutationFn: (to_unblock_id: string) => unblock(to_unblock_id),
    onSuccess: (_, to_unblock_id) => {
      queryClient.setQueryData(["blocked"], (old: any) => {
        return old.filter((el: any) => el.id !== to_unblock_id);
      });
      sendJsonMessage({ message: `/friendUpdate ${to_unblock_id}` });
      toast.success("unblocked successfully");
    },
    onError: (err) => {
      toast.error("Something went wrong");
    },
  });
  return mutation;
}
