import axiosInstance from "@/lib/functions/axiosInstance";
import { UserContext } from "@/lib/providers/UserContext";
import { User } from "@/lib/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { toast } from "sonner";

const editAvatar = async (data: User) => {
  try {
    const response = await axiosInstance.put(`/user/${data.id}/avatar`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status !== 401) {
      throw new Error(error.response.data.message);
    }
  }
};

export default function useEditAvatar() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const info = useMutation({
    mutationFn: async (data: User) => {
      const res = await editAvatar(data);
      return res;
    },
    onSuccess: (data) => {
      console.log(data);
      setCurrentUser(data);
      toast.success("Avatar updated successfully");
    },
  });
  return info;
}
