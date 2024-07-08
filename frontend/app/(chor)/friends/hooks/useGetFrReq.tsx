import axiosInstance from "@/lib/functions/axiosInstance";
import getCookie from "@/lib/functions/getCookie";
import { useQuery } from "@tanstack/react-query";

async function getFrdReq() {
  // not send request to server if user is not logged in
  const is_logged_in = getCookie("logged_in");
  if (is_logged_in !== "yes") {
    return [];
  }

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
