import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// login hook
export default function useLogin() {
  const mutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await axiosInstance.post("/login", data);
      return response.data;
    },
  });
  return mutation;
}
