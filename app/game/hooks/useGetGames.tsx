import axiosInstance from "@/lib/functions/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import type { t_Game } from "@/lib/types";

const getOnGoingGame = async () => {
    try {
        const response = await axiosInstance.get('/game/onGoingGame')
        if (response.data.status === 204) {
            return {game: null};
        }
        const game: t_Game = response.data;
        return {game};
    }
    catch (error) {
        return {game: null};
    }
}

export default function useGetGame(userId: string) {
    const data = useQuery({
        queryKey: ["game", userId],
        queryFn: () => getOnGoingGame(),
    });

    return {onGoingGame: data};
}