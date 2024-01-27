import axiosInstance from "@/lib/functions/axiosInstance";
import { UserContext } from "@/lib/providers/UserContext";
import { User } from "@/lib/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { toast } from "sonner";

const editAvatar = async (data: { id: string; avatar: File }) => {
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
    mutationFn: async (data: { id: string; avatar: File }) => {
      const res = await editAvatar(data);
      return res;
    },
    onSuccess: (data) => {
      // console.log(data);
      if (currentUser) {
        setCurrentUser({
          ...currentUser,
          avatar: data.avatar,
          id: currentUser.id || "",
        });
      }
      toast.success("Avatar updated successfully");
    },
    onError: (error: Error) => {
      toast.error("Avatar update failed");
    },
  });
  return info;
}
