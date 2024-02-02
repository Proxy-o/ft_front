import axiosInstance from "@/lib/functions/axiosInstance";
import { UserContext } from "@/lib/providers/UserContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { toast } from "sonner";

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

export default function useInviteFriend() {
  const queryClient = useQueryClient();

  const info = useMutation({
    mutationFn: async (userId: string) => {
      const res = await inviteFriend(userId);
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["requests"],
      });
      toast.success("Invitation sent successfully");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return info;
}
