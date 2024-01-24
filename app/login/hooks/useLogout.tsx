import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// login hook
export default function useLogout() {
  const mutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const path = process.env.NEXT_PUBLIC_API_URL + "/logout";
      const response = await axios.post(path, data);
      return response.data;
    },
  });
  return mutation;
}
