import axiosInstance from "@/lib/functions/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const fetchTournament = async ({ userid }: { userid: string }) => {
  try {
    if (userid === "0") return null;
    const response = await axiosInstance.get(`/game/tournaments/user/${userid}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status !== 401) {
      throw new Error(error.response.data.message);
    }
  }
};

export default function useGetTournaments(userid: string) {
  const info = useQuery({
    queryKey: ["Tournament", userid],
    queryFn: () => fetchTournament({ userid }),
  });
  return info;
}
