import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchClient = async ({ id, token }: { id: string; token: string }) => {
  const response = await axios.get(
    process.env.NEXT_PUBLIC_API_URL + `/user/${id}`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return response.data;
};

export default function useGetClient() {
  const info = useMutation({
    mutationFn: async ({ id, token }: { id: string; token: string }) => {
      const data = await fetchClient({ id, token });
      return data;
    },
  });
  return info;
}
