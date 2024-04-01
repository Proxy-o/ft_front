import axiosInstance from "@/lib/functions/axiosInstance";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Conversation } from "../types";

async function getMessages({ pageParam }: { pageParam: string }) {
  if (!pageParam) return;
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
      if (lastPage && lastPage.next !== null) {
        return lastPage.next.split("/").slice(5).join("/");
      }
      return false;
    },
  });
  return res;
}
