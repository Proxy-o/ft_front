import axiosInstance from "@/lib/functions/axiosInstance";

async function markAsRead(friend_id: string) {
  const response = await axiosInstance.post(
    `/chat/unread_messages/${friend_id}`
  );
  return response.data;
}
export default async function readMessages(friend_id: string) {
  const res = await markAsRead(friend_id);
  return res;
}
