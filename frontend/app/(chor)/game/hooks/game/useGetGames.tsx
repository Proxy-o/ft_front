import axiosInstance from "@/lib/functions/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

const getOnGoingGame = async (type: string, tournamentId?: string) => {
  try {
    let response: AxiosResponse<any, any> | undefined;
    if (type === "tournament")
      response = await axiosInstance.get(
        `/game/onGoingTournamentGame/${tournamentId}`
      );
    else if (type === "two")
      response = await axiosInstance.get("/game/onGoingGame");
    if (response?.status === 204) {
      return { game: null };
    }

    return { game: response?.data };
  } catch (error) {
    return { game: null };
  }
};

export default function useGetGame(userId: string, type: string, tournamentId?: string) {
  const data = useQuery({
    queryKey: ["game", userId],
    queryFn: () => getOnGoingGame(type, tournamentId),
  });
  return { onGoingGame: data };
}
