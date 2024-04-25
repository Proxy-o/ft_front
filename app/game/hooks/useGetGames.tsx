import axiosInstance from "@/lib/functions/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

const getOnGoingGame = async (type: string) => {
  try {
    let response: AxiosResponse<any, any> | undefined;
    if (type === "tournament")
      response = await axiosInstance.get("/game/onGoingTournamentGame");
    else if (type === "two")
      response = await axiosInstance.get("/game/onGoingGame");
    if (response?.data.status === 204) {
      return { game: null };
    }

    return { game: response?.data };
  } catch (error) {
    return { game: null };
  }
};

export default function useGetGame(userId: string, type: string) {
  const data = useQuery({
    queryKey: ["game", userId],
    queryFn: () => getOnGoingGame(type),
  });
  return { onGoingGame: data };
}
