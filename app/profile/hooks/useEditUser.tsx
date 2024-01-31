import axiosInstance from "@/lib/functions/axiosInstance";
import { UserContext } from "@/lib/providers/UserContext";
import { User } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { toast } from "sonner";

const editUser = async (data: User) => {
  try {
    // remove avatar from user object
    delete data.avatar;
    const response = await axiosInstance.put(`/user/${data.id}`, data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status !== 401) {
      throw new Error(error.response.data.message);
    }
  }
};

export default function useEditUser() {
  // invalidate user cache
  const queryClient = useQueryClient();

  const info = useMutation({
    mutationFn: async (data: User) => {
      const res = await editUser(data);
      return res;
    },
    onSuccess: (data) => {
      console.log("data", data.id);
      queryClient.invalidateQueries({
        queryKey: [`user`],
      });
      toast.success("Profile updated successfully");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return info;
}
