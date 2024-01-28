import axiosInstance from "@/lib/functions/axiosInstance";
import { UserContext } from "@/lib/providers/UserContext";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

export default function useGetMessages({
  senderId,
  receiverId,
}: {
  senderId: string;
  receiverId: string;
}) {
  const queryKey = [`messages_${senderId}_${receiverId}`];

  const res = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await axiosInstance.get(
        `chat/${senderId}/${receiverId}`
      );
      return response.data;
    },
  });
  return res;
}
