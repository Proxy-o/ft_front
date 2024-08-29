import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { setLoginCookie } from "./useLogin";

export default function useOAuthLogin() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (provider: string) => {
      try {
        const response = await axiosInstance.post(`/redirect/${provider}`);
        return response.data;
      } catch (error: any) {
        if (error.response) {
          const data = error.response.data;
          if (data.detail === "2FA required") {
            var date = new Date();
            date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
            var expires = "; expires=" + date.toUTCString();
            var sameSite = "; SameSite=None; Secure";
            document.cookie = "user_id=" + data.user_id + expires + "; path=/" + sameSite;
            router.push("/verifyOTP");
          }
        }
      }
    },
    onSuccess: (data) => {
      setLoginCookie(data);
      router.push("/");
    },
  });
  return mutation;
}