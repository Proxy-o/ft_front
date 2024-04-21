import axiosInstance from "@/lib/functions/axiosInstance";
import getCookie from "@/lib/functions/getCookie";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// login hook
export default function useLogout() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const data = {
        refresh: getCookie("refresh"),
      };
      const response = await axiosInstance.post("/logout", data);
      document.cookie =
        "access=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure;";
      document.cookie =
        "refresh=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;SameSite=None; Secure;";
      document.cookie =
        "logged_in=no;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;SameSite=None; Secure;";
      document.cookie =
        "user_id=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;SameSite=None; Secure;";

      return response.data;
    },
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ["user"],
      });
    },
  });
  return mutation;
}
