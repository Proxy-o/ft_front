import axiosInstance from "@/lib/functions/axiosInstance";
import { User } from "@/lib/types";
import { useMutation, useQuery } from "@tanstack/react-query";

const editUser = async (data: User) => {
  try {
    const response = await axiosInstance.put(`/user/${data.id}`, data);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status !== 401) {
      throw new Error(error.response.data.message);
    }
  }
};

export default function useEditUser() {
  const info = useMutation({
    mutationFn: async (data: User) => {
      const res = await editUser(data);
      return res;
    },
  });
  return info;
}
