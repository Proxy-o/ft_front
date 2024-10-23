import axiosInstance from "@/lib/functions/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

const fetchUser = async ({ id }: { id: string }, router: ReturnType<typeof useRouter>) => {
  try {
    const response = await axiosInstance.get(`/user/${id}`);
    return response.data;
  } catch (error: any) {
    if (id === '0' && error.response.status === 401) {
      toast.info("Logged out! see you soon!")
      router.push("/login");
      return;
    }
    throw new Error(error.response.data.message);
  }
};

export default function useGetUser(id: string | null) {
  const router = useRouter();

  const memoizedFetchUser = useCallback(() => fetchUser({ id } as { id: string }, router), [id, router]);

  const info = useQuery({
    queryKey: ["user", id],
    queryFn: memoizedFetchUser,
    enabled: !!id,
    retry: false,
  });
  return info;
}
