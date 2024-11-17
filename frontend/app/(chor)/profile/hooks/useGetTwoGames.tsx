import axiosInstance from "@/lib/functions/axiosInstance";
import { useInfiniteQuery } from "@tanstack/react-query";

const fetchGames = async ({
  id,
  pageParam,
}: {
  id: string;
  pageParam: string;
}) => {
  try {
    if (id === "0") return null;
    const response = await axiosInstance.get(
      `/game/twovtwo/user/${id}?page=${pageParam}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status !== 401) {
      throw new Error(error.response.data.message);
    }
  }
};

export default function useGetTwoGames(id: string) {
  const info = useInfiniteQuery({
    queryKey: [`games_2v2_${id}`],
    queryFn: ({ pageParam }) => fetchGames({ id, pageParam }),
    initialPageParam: `1`,
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.next) {
        return lastPage.next.split("=").pop();
      }
      return false;
    },
    retry: 3,
  });
  return info;
}
