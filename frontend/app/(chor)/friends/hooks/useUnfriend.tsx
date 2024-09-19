import axiosInstance from "@/lib/functions/axiosInstance";
import getCookie from "@/lib/functions/getCookie";
import { User } from "@/lib/types";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import useWebSocket from "react-use-websocket";

import { toast } from "sonner";

async function unfriend(to_unfriend_id: string) {
  const response = await axiosInstance.post(
    `/friends/remove/${to_unfriend_id}`
  );
  return response.data;
}

export default function useUnfriend() {
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
      to_unfriend,
      user_id,
    }: {
      to_unfriend: User;
      user_id: string;
    }) => unfriend(to_unfriend.id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["friends", variables.user_id],
      });
      sendJsonMessage({ message: `/friendUpdate ${variables.to_unfriend.id}` });
      
      toast.success("Unfriended successfully");
    },
    onError: (err) => {
      toast.error("Something went wrong");
    },
  });
  return mutation;
}
