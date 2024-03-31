import axiosInstance from "@/lib/functions/axiosInstance";

async function getUsers() {
  const response = await axiosInstance.post("/chat/unread_messages");
  return response.data;
}
export default async function readMessages() {
  const res = await getUsers();
  return res;
}
