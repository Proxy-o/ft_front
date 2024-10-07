import axiosInstance from "@/lib/functions/axiosInstance";
import { deleteCookie } from "@/lib/functions/getCookie";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      const data = {};
      const response = await axiosInstance.post("/logout", data);
      return response.data;
    },
    onSuccess: () => {
      deleteCookie("logged_in");
      deleteCookie("access");
      queryClient.removeQueries({
        queryKey: ["user"],
      });
      router.push("/");
    },
    onError: (error) => toast.error(error.message),
  });
  return mutation;
}
