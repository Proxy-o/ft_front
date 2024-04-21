import axiosInstance from "@/lib/functions/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const fetchGames = async ({ id }: { id: string }) => {
  try {
    if (id === "0") return null;
    const response = await axiosInstance.get(`/game/user/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status !== 401) {
      throw new Error(error.response.data.message);
    }
  }
};

export default function useGetGames(id: string) {
  const info = useQuery({
    queryKey: ["Games", id],
    queryFn: () => fetchGames({ id }),
  });
  return info;
}
