import axiosInstance from "@/lib/functions/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import TournamentBoard from "../components/tournamentBoard";

const getTournament = async (tournamentId?: string) => {
  try {
    const url = (tournamentId) ? `/game/tournament/${tournamentId}` : `/game/OngoingTournament`;
    const response = await axiosInstance.get(
      url
    );
    if (response.data.status === 204) {
      return { tournament: null };
    }
    return { tournament: response?.data };
  } catch (error) {
    return { tournament: null };
  }
};

export default function useGetTournament(tournamentId?: string) {
  const data = useQuery({
    queryFn: () => getTournament(tournamentId),
    queryKey: ["tournament"],
  });
  return data;
}
