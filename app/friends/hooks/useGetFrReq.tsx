import axiosInstance from "@/lib/functions/axiosInstance";
import { useQuery } from "@tanstack/react-query";

async function getFrdReq() {
  const response = await axiosInstance.get(`/friend_request`);
  return response.data;
}
export default function useGetFrdReq() {
  const queryKey = ["requests"];

  const res = useQuery({
    queryKey: queryKey,
    queryFn: () => getFrdReq(),
  });
  return res;
}
