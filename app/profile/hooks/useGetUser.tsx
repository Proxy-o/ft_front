import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUser = async ({ id, token }: { id: string; token: string }) => {
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

export default function useGetUser() {
  const info = useMutation({
    mutationFn: async ({ id, token }: { id: string; token: string }) => {
      const data = await fetchUser({ id, token });
      return data;
    },
  });
  return info;
}
