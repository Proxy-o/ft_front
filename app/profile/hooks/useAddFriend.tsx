import axiosInstance from "@/lib/functions/axiosInstance";
import { UserContext } from "@/lib/providers/UserContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { toast } from "sonner";

const inviteFriend = async (userId: string) => {
  try {
    const response = await axiosInstance.post(`/friend_request/${userId}`);
    console.log("ok", response);
    return response.data;
  } catch (error: any) {
    console.log("error", error.response.data.detail);
    if (error.response && error.response.status !== 401) {
      throw new Error(error.response.data.detail);
    }
  }
};

export default function useInviteFriend() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const info = useMutation({
    mutationFn: async (userId: string) => {
      const res = await inviteFriend(userId);
      return res;
    },
    onSuccess: (data) => {
      toast.success("Invitation sent successfully");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return info;
}
