import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation } from "@tanstack/react-query";

const searchFriend = async (data: { slug: string }) => {
  try {
    if (data.slug.length < 1) {
      return [];
    }
    const response = await axiosInstance.get(`/friends/search/${data.slug}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status !== 401) {
      throw new Error(error.response.data.message);
    }
  }
};

export default function useSearchFriend() {
  const info = useMutation({
    mutationFn: async (data: { slug: string }) => {
      const res = await searchFriend(data);
      return res;
    },
  });
  return info;
}
