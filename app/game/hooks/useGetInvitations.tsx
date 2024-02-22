import axiosInstance from "@/lib/functions/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const getInvitations = async () => {
        const response = await axiosInstance.get(`/game/invitations`);
        return response.data;
}

export default function useGetInvitations(userId: string) {
    const { data } = useQuery({
            queryKey: ["invitations", userId],
            queryFn: () => getInvitations(),
        },
    );
    return data;
}
