import axiosInstance from "@/lib/functions/axiosInstance";
import { useQuery } from "@tanstack/react-query";

async function getFriends(userId?: string) {
  if (!userId ) {
    return [];
  }
  const response = await axiosInstance.get(`/friends/${userId}`);
  return response.data;
}
export default function useGetFriends(userId?: string) {
  const queryKey = ["friends", userId];

  const res = useQuery({
    queryKey: queryKey,
    queryFn: () => getFriends(userId),
  });
  return res;
}
