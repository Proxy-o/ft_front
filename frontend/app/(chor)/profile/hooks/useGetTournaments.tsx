import axiosInstance from "@/lib/functions/axiosInstance";
import { useInfiniteQuery } from "@tanstack/react-query";

const fetchTournaments = async ({
  id,
  pageParam,
}: {
  id: string;
  pageParam: string;
}) => {
  try {
    if (id === "0") return null;
    const response = await axiosInstance.get(
      `/game/tournaments/user/${id}?page=${pageParam}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status !== 401) {
      throw new Error(error.response.data.message);
    }
  }
};

export default function useGetournaments(id: string) {
  const info = useInfiniteQuery({
    queryKey: [`tourn_${id}`],
    queryFn: ({ pageParam }) => fetchTournaments({ id, pageParam }),
    initialPageParam: `1`,
    getNextPageParam: (lastPage) => {
      if (lastPage.next) {
        return lastPage.next.split("=").pop();
      }
      return false;
    },
  });
  return info;
}
