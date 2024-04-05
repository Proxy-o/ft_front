import axiosInstance from "@/lib/functions/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const getOnGoingFourGame = async () => {
  try {
    const response = await axiosInstance.get("/game/onGoingFourGame");
    if (response.data.status === 204) {
      return { game: null };
    }
    return { game: response.data };
  } catch (error) {
    return { game: null };
  }
};

export default function useGetFourGame(userId: string) {
  const data = useQuery({
    queryKey: ["game", userId],
    queryFn: () => getOnGoingFourGame(),
  });
  return { onGoingGame: data };
}
