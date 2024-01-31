import axiosInstance from "@/lib/functions/axiosInstance";
import { useQuery } from "@tanstack/react-query";

async function getBlockedUsers() {
  const response = await axiosInstance.get(`/friends/blocked`);
  return response.data;
}
export default function useGetBlocked() {
  const queryKey = ["friends", "blocked"];

  const res = useQuery({
    queryKey: queryKey,
    queryFn: () => getBlockedUsers(),
  });
  return res;
}
