import axiosInstance from "@/lib/functions/axiosInstance";
import getCookie, { deleteCookie } from "@/lib/functions/getCookie";
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
      const response = await axiosInstance.post("/logout", data);
      return response.data;
    },
    onSuccess: () => {
      toast.info("Logged out!see you soon");
      deleteCookie("logged_in");
      deleteCookie("refresh");
      deleteCookie("access");
      deleteCookie("user_id");
      queryClient.removeQueries({
        queryKey: ["user"],
      });
      router.push("/");
    },
    onError: (error) => toast.error(error.message),
  });
  return mutation;
}
