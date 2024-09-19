import axiosInstance from "@/lib/functions/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const getOnGoingTournament = async () => {
  try {
    const response = await axiosInstance.get(`/game/OngoingTournament`);
    if (response.data.status === 204) {
      return { tournament: null };
    } else if (response.data.status === 404) {
      return { tournament: null };
    }
    return { tournament: response?.data };
  } catch (error) {
    return { tournament: null };
  }
};

export default function useGetOnGoingTournament() {
  const data = useQuery({
    queryFn: () => getOnGoingTournament(),
    queryKey: ["tournament"],
  });
  return data;
}
