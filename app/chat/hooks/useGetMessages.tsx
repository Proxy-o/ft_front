import axiosInstance from "@/lib/functions/axiosInstance";
import { UserContext } from "@/lib/providers/UserContext";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { Conversation } from "../types";

async function getMessages({ pageParam }: { pageParam: string }) {
  const response = await axiosInstance.get(`chat/${pageParam}`);
  return response.data;
}
export default function useGetMessages({ senderId, receiverId }: Conversation) {
  const queryKey = [`messages_${senderId}_${receiverId}`];

  const res = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => getMessages({ pageParam }),
    initialPageParam: `${senderId}/${receiverId}?page=1`,
    getNextPageParam: (lastPage) => {
      if (lastPage.next !== null) {
        return lastPage.next.split("/").slice(5).join("/");
      }
      return false;
    },
  });
  return res;
}