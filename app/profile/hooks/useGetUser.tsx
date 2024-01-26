import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation, useQuery } from "@tanstack/react-query";

const fetchUser = async ({ id }: { id: string }) => {
  try {
    if (id === "0") throw new Error("User not found");
    const response = await axiosInstance.get(`/user/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status !== 401) {
      throw new Error(error.response.data.message);
    }
  }
};

export default function useGetUser() {
  const info = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const data = await fetchUser({ id });
      return data;
    },
  });
  return info;
}
