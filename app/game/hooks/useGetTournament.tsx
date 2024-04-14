import axiosInstance from "@/lib/functions/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const getTournament = async () => {
  try {
    const response = await axiosInstance.get("/game/tournament");
    if (response.data.status === 204) {
      return { tournament: null };
    }
    return { tournament: response.data };
  } catch (error) {
    return { tournament: null };
  }
};

export default function useGetTournament(userId: string) {
  const data = useQuery({
    queryKey: ["tournament", userId],
    queryFn: () => getTournament(),
  });
  return { tournament: data };
}
