import axiosInstance from "@/lib/functions/axiosInstance";
import { UserContext } from "@/lib/providers/UserContext";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { Conversation } from "../types";

export default function useGetMessages({ senderId, receiverId }: Conversation) {
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
