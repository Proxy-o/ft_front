import axiosInstance from "@/lib/functions/axiosInstance";
import { t_Invitation } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

const getInvitations = async () => {
  try {
    const response = await axiosInstance.get(`/game/invitations`);
    let invitations: t_Invitation[] = response.data;
    return invitations;
  } catch (error) {
    console.log(error);
  }
};

export default function useGetInvitations(userId: string) {
  const invitations = useQuery({
    queryKey: ["invitations", userId],
    queryFn: () => getInvitations(),
  });
  return invitations;
}
