import axiosInstance from "@/lib/functions/axiosInstance";
import getCookie from "@/lib/functions/getCookie";
import { User } from "@/lib/types";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import useWebSocket from "react-use-websocket";

import { toast } from "sonner";

async function acceptFriend(to_accept_id: string) {
  const response = await axiosInstance.post(
    `/friend_request/accept/${to_accept_id}`
  );
  return response.data;
}

export default function useAcceptFriend() {
  const queryClient = useQueryClient();
  // send message in socket
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
      user_id,
      friend,
      to_accept_id,
    }: {
      user_id: string;
      friend: User;
      to_accept_id: string;
    }) => acceptFriend(to_accept_id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["requests"],
      });
      queryClient.invalidateQueries({
        queryKey: ["friends", variables.user_id],
      });

      sendJsonMessage({ message: `/friendUpdate ${variables.friend.id}` });


      toast.success("Friend request accepted");
    },
    onError: (err) => {
      toast.error("You cannot accept this friend request");
    },
  });
  return mutation;
}
