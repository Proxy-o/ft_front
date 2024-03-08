import axiosInstance from "@/lib/functions/axiosInstance";
import { useQuery, useQueryClient } from "@tanstack/react-query";

async function getOnGoingGame() {
    const response = await axiosInstance.get('/game/onGoingGame')
    return response.data;

}
export default function useGetGame(userId: string) {

    const queryClient = useQueryClient();
    const {data} = useQuery({
        queryKey: ["game", userId],
        queryFn: () => getOnGoingGame(),
    })
}