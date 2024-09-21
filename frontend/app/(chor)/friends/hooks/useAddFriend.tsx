import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useChatSocket from "../../game/hooks/sockets/useChatSocket";

const inviteFriend = async (userId: string) => {
  try {
    const response = await axiosInstance.post(`/friend_request/${userId}`);

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status !== 401) {
      throw new Error(error.response.data.detail);
    }
  }
};

export default function useAddFriend() {
  const queryClient = useQueryClient();
  const { sendJsonMessage } = useChatSocket()
  const info = useMutation({
    mutationFn: async (userId: string) => {
      const res = await inviteFriend(userId);
      return res;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["requests"],
      });
      sendJsonMessage({ message: `/request ${variables}` });
      toast.success("Invitation sent successfully");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return info;
}
