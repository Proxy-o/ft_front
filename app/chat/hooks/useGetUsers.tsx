import axiosInstance from "@/lib/functions/axiosInstance";
import { useQuery } from "@tanstack/react-query";

async function getUsers() {
  const response = await axiosInstance.get("/user");
  return response.data;
}
export default function useGetUsers() {
  const queryKey = ["users"];

  const res = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  return res;
}
