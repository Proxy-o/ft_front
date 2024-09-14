import axiosInstance from "@/lib/functions/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import TournamentBoard from "../components/tournamentBoard";

const getTournament = async (tournamentId: string) => {
  try {
    const response = await axiosInstance.get(
      `/game/tournament/${tournamentId}`
    );
    if (response.data.status === 204) {
      return { tournament: null };
    }
    return { tournament: response?.data };
  } catch (error) {
    return { tournament: null };
  }
};

export default function useGetTournament(tournamentId: string) {
  console.log("getting tournament");
  const data = useQuery({
    queryFn: () => getTournament(tournamentId),
    queryKey: ["tournament", tournamentId],
  });
  console.log("dataa", data);
  return {
    tournament: data,
  };
}
