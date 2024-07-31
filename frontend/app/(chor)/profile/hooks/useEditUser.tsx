import axiosInstance from "@/lib/functions/axiosInstance";
import { User } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const editUser = async (user: User) => {

    delete user.avatar;
    const response = await axiosInstance.put(`/user/${user.id}`, user);
    return response.data;
  
};

export default function useEditUser() {
  const queryClient = useQueryClient();

  const info = useMutation({
    mutationFn: async (info: User) => {
      
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
      if (err.response.data.username) {
        toast.error(err.response.data.username[0]);
      }
      else if (err.response.data.email) {
        toast.error(err.response.data.email[0]);
      }
      else if (err.response.data.password) {
        toast.error(err.response.data.password[0]);
      }
      else {
        toast.error("An error occurred while updating your profile");
      }
    },
  });
  return info;
}