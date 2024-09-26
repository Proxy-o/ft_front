import axiosInstance from "@/lib/functions/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const fetchUser = async ({ id }: { id: string }) => {
  try {
    const response = await axiosInstance.get(`/user/${id}`);
    return response.data;
  } catch (error: any) {
    if (id === '0' && error.response.status === 401) {
      toast.error("Error: Authentication required")
    }
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
