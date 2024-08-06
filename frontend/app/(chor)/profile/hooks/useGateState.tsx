import axiosInstance from "@/lib/functions/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const fetchStates = async ({ id }: { id: string }) => {
  try {
    if (id === "0") return null;
    const response = await axiosInstance.get(`/game/states/${id}`);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export default function useGetStates(id: string) {
  const info = useQuery({
    queryKey: ["States", id],
    queryFn: () => fetchStates({ id }),
  });
  return info;
}
