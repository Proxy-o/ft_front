import axiosInstance from "@/lib/functions/axiosInstance";
import getCookie from "@/lib/functions/getCookie";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      const data = {
        refresh: getCookie("refresh"),
      };
      document.cookie =
      "access=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None;";
      document.cookie =
      "refresh=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None;";
      document.cookie =
      "logged_in=no;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None;";
      document.cookie =
      "user_id=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None;";
      const response = await axiosInstance.post("/logout", data);

      return response.data;
    },
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ["user"],
      });
      router.push("/login");
    },
    onError: (error) => toast.error(error.message),
  });
  return mutation;
}
