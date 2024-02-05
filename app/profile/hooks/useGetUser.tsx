import axiosInstance from "@/lib/functions/axiosInstance";
import { UserContext } from "@/lib/providers/UserContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext } from "react";

const fetchUser = async ({ id }: { id: string }) => {
  try {
    if (id === "0") return null;
    const response = await axiosInstance.get(`/user/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status !== 401) {
      throw new Error(error.response.data.message);
    }
  }
};

export default function useGetUser(id: string) {
  const info = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const data = await fetchUser({ id });
      return data;
    },
  });
  return info;
}
