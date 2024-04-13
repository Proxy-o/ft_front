import axiosInstance from "@/lib/functions/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const getTournement = async () => {
  try {
    const response = await axiosInstance.get("/game/tournament");
    if (response.data.status === 204) {
      return { tournement: null };
    }
    return { tournement: response.data };
  } catch (error) {
    return { tournement: null };
  }
};

export default function useGetTournement(userId: string) {
  const data = useQuery({
    queryKey: ["tournement", userId],
    queryFn: () => getTournement(),
  });
  return { tournement: data };
}
