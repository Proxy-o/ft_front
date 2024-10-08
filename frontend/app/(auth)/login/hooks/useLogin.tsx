import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { setCookie } from "@/lib/functions/getCookie";
import { LoginParams } from "@/lib/types";
import { toast } from "sonner";

const useLogin = () => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: LoginParams) => {
      try {
        const response = await axiosInstance.post("/login", data);
        return response.data;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.detail || "An error occurred during login"
        );
      }
    },
    onSuccess: (data) => {
      if (!data) {
        router.push("/login");
        return;
      }
      if (data.detail === "2FA required") {
        router.push("/verifyOTP?user_id=" + data.user_id);
        return;
      }
      setCookie("logged_in", "yes");
      router.push("/game");
    },
    onError: (error) => {
      toast.error(error.message);
      router.push("/login");
      return;
    },
  });

  return mutation;
};

export default useLogin;
