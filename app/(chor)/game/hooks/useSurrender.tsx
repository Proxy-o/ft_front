import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const surrenderGame = async () => {
    try {
        const res = await axiosInstance.post('/game/surrender');
        if (res.status === 204)
            toast.warning("your opponent has already surrendered");
        else
            toast.warning("You have surrendered");
    }
    catch (error) {
        console.log(error);
    }
}

export default function useSurrenderGame() {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: () => surrenderGame(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["game"] });
        }
    });
    return mutation;
}