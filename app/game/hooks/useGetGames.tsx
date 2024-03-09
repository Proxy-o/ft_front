import axiosInstance from "@/lib/functions/axiosInstance";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const getOnGoingGame = async () => {
    try {
        const response = await axiosInstance.get('/game/onGoingGame')
        if (response.data.error) {
            return {game: null};
        }
        return {game: response.data.game};
    }
    catch (error) {
        return {game: null};
    }
    return {game: null};
}

export default function useGetGame(userId: string) {
    const queryClient = useQueryClient();
    const {data} = useQuery({
        queryKey: ["game", userId],
        queryFn: () => getOnGoingGame(),
    })

    const surrenderGame = async () => {
        try {
            await axiosInstance.post('/game/surrender');
            queryClient.invalidateQueries({queryKey: ["game"]});
        }
        catch (error) {
            console.log(error);
        }
    }

    const refetchOnGoingGame = () => {
        queryClient.invalidateQueries({queryKey: ["game"]});
    }
    return {onGoingGame: data, refetchOnGoingGame, surrenderGame};
}