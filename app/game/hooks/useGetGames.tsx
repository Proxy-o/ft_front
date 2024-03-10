import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { t_Game } from "@/lib/types";
import { toast } from "sonner";

const getOnGoingGame = async () => {
    try {
        const response = await axiosInstance.get('/game/onGoingGame')
        console.log("response");
        console.log(response);
        if (response.data.error) {
            return {game: null};
        }
        const game: t_Game = response.data;
        return {game};
    }
    catch (error) {
        return {game: null};
    }
    return {game: null};
}
const surrenderGame = async () => {
    try {
        const res = await axiosInstance.post('/game/surrender');
        if (res.status === 204) {
            toast.warning("your opponent has already surrendered");
        }
    }
    catch (error) {
        console.log(error);
    }
}

export default function useGetGame(userId: string) {
    const queryClient = useQueryClient();
    const {data} = useQuery({
        queryKey: ["game", userId],
        queryFn: () => getOnGoingGame(),
    })

    const {mutateAsync: surrenderMutation} = useMutation({
        mutationFn: surrenderGame,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["game"]});
        }
    });

    const refetchOnGoingGame = async () => {
        queryClient.invalidateQueries({queryKey: ["game"]});
    }

    return {onGoingGame: data, refetchOnGoingGame, surrenderGame: surrenderMutation};
}