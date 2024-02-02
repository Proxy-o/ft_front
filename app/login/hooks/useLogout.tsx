import axiosInstance from "@/lib/functions/axiosInstance";
import getCookie from "@/lib/functions/getCookie";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// login hook
export default function useLogout() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      const data = {
        refresh: getCookie("refresh"),
      };
      const response = await axiosInstance.post("/logout", data);
      // remove cookies
      document.cookie =
        "access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      // change logged_in state
      document.cookie =
        "logged_in=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      router.push("/login");
      return response.data;
    },
  });
  return mutation;
}
