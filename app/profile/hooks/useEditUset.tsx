import axiosInstance from "@/lib/functions/axiosInstance";
import { UserContext } from "@/lib/providers/UserContext";
import { User } from "@/lib/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { toast } from "sonner";

const editUser = async (data: User) => {
  try {
    const response = await axiosInstance.put(`/user/${data.id}`, data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status !== 401) {
      throw new Error(error.response.data.message);
    }
  }
};

export default function useEditUser() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const info = useMutation({
    mutationFn: async (data: User) => {
      const res = await editUser(data);
      return res;
    },
    onSuccess: (data) => {
      // console.log(data);
      toast.success("Profile updated successfully");
      setCurrentUser({ ...currentUser, ...data });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return info;
}
