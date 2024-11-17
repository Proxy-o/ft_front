import axiosInstance from "@/lib/functions/axiosInstance";
import { deleteCookie } from "@/lib/functions/getCookie";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function useLogout() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.get("/logout");
      return response.data;
    },
    onSuccess: () => {
      deleteCookie("access");
      deleteCookie("logged_in");
      router.push("/login");
      return
    },
    onError: (error) => toast.error(error.message),
  });
  return mutation;
}
