import axiosInstance from "@/lib/functions/axiosInstance";
import getCookie from "@/lib/functions/getCookie";
import { useQuery } from "@tanstack/react-query";

async function fetchGlobalState() {
  const logged_in = getCookie("logged_in") === "yes";
  if (!logged_in) {
    return [];
  }
  const response = await axiosInstance.get(`/game/globalstates`);
  // console.log(response.data);
  return response.data;
}

export default function useGetGlobalState() {
  const queryKey = ["globalstates"];
  const info = useQuery({
    queryKey,
    queryFn: fetchGlobalState,
  });
  return info;
}
