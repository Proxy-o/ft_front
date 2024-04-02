import axiosInstance from "@/lib/functions/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const getOnGoingGame = async () => {
  try {
    const response = await axiosInstance.get("/game/onGoingGame");
    if (response.data.status === 204) {
      return { game: null };
    }
    return { game: response.data };
  } catch (error) {
    return { game: null };
  }
};

export default function useGetGame(userId: string) {
  const data = useQuery({
    queryKey: ["game", userId],
    queryFn: () => getOnGoingGame(),
  });
  return { onGoingGame: data };
}
