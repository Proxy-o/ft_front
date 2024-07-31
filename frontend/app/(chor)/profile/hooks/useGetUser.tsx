import axiosInstance from "@/lib/functions/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const fetchUser = async ({ id }: { id: string }) => {
  try {
    if (id === "0") return null;
    const response = await axiosInstance.get(`/user/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export default function useGetUser(id: string) {
  const info = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser({ id }),
  });
  return info;
}