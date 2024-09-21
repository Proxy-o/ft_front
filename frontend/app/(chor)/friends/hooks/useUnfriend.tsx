import axiosInstance from "@/lib/functions/axiosInstance";
import getCookie from "@/lib/functions/getCookie";
import { User } from "@/lib/types";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import useWebSocket from "react-use-websocket";

import { toast } from "sonner";
import useChatSocket from "../../game/hooks/sockets/useChatSocket";

async function unfriend(to_unfriend_id: string) {
  const response = await axiosInstance.post(
    `/friends/remove/${to_unfriend_id}`
  );
  return response.data;
}

export default function useUnfriend() {
  const queryClient = useQueryClient();
  const { sendJsonMessage } = useChatSocket()
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
