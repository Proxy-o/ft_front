import axiosInstance from "@/lib/functions/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const fetchUser = async ({ id }: { id: string }, router: ReturnType<typeof useRouter>) => {
  try {
    const response = await axiosInstance.get(`/user/${id}`);
    return response.data;
  } catch (error: any) {
    console.dir(error)
    toast.error(`Error: ${error.response.data.message}`)
    if (id === '0' && error.response.status === 401) {
      router.push("/login")
    }
    throw new Error(error.response.data.message);
  }
};

export default function useGetUser(id: string | null) {
  const router = useRouter();
  const info = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser({ id } as { id: string }, router),
  });
  return info;
}
