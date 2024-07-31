import axiosInstance from "@/lib/functions/axiosInstance";
import { User } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const editUser = async (user: User) => {
  try {
    // remove avatar from user object
    delete user.avatar;
    console.log("user", user);
    const response = await axiosInstance.put(`/user/${user.id}`, user);
    console.log("response", response);
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
    mutationFn: async (info: User) => {
    console.log("info", info);

      const res = await editUser(info);
      return res;
    },
    onSuccess: (_, user) => {
      queryClient.setQueryData(["user", user.id], user);
      if (!_)
        return toast.error("An error occurred while updating your profile");
      toast.success("Profile updated successfully");
    },
    onError: (err) => {
      console.log("err", err);
      toast.error(err.message);
    },
  });
  return info;
}
