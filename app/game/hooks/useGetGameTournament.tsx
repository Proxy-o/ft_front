import axiosInstance from "@/lib/functions/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const getOnGoingTournamentGame = async () => {
  try {
    const response = await axiosInstance.get("/game/onGoingTournamentGame");
    if (response.data.status === 204) {
      return { game: null };
    }
    return { game: response.data };
  } catch (error) {
    return { game: null };
  }
};

export default function useGetTournamentGame(userId: string) {
  const data = useQuery({
    queryKey: ["gameTournament", userId],
    queryFn: () => getOnGoingTournamentGame(),
  });
  return { onGoingGame: data };
}
