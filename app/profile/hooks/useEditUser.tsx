import axiosInstance from "@/lib/functions/axiosInstance";
import { UserContext } from "@/lib/providers/UserContext";
import { User } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { toast } from "sonner";

const editUser = async (user: User) => {
  try {
    // remove avatar from user object
    delete user.avatar;
    const response = await axiosInstance.put(`/user/${user.id}`, user);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status !== 401) {
      throw new Error(error.response.data.message);
    }
  }
};

export default function useEditUser() {
  const queryClient = useQueryClient();

  const info = useMutation({
    mutationFn: async (user: User) => {
      const res = await editUser(user);
      return res;
    },
    onSuccess: (_, user) => {
      queryClient.setQueryData(["user", user.id.toString()], (old: any) => {
        return { ...old, ...user };
      });
      toast.success("Profile updated successfully");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return info;
}
