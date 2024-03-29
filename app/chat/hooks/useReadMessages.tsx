import axiosInstance from "@/lib/functions/axiosInstance";

async function getUsers() {
  const response = await axiosInstance.post("/chat/unread_messages");
  console.log(response);
  return response.data;
}
export default async function useReadMessages() {
  const res = await getUsers();
  return res;
}
