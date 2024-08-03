import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const setLoginCookie = (data: any) => {
  var date = new Date();
  date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
  var expires = "; expires=" + date.toUTCString();
  // add same site and secure
  // document.cookie = "access=" + data.access + expires + "; path=/" + "; h"
  // document.cookie = "refresh=" + data.refresh + expires + "; path=/";
  document.cookie = "logged_in=yes" + expires + "; path=/" + "; SameSite=lax; ";
  document.cookie = "user_id=" + data.user.id + expires + "; path=/" + "; SameSite=lax; ";
};

export default function useLogin() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      try {
        console.log("hahah");
        const response = await axiosInstance.post("/login", data);
        console.log(response.data);
        return response.data;
      } catch (error: any) {
        if (error.response) {
          const data = error.response.data;
          if (data.detail === "2FA required") {
            var date = new Date();
            date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
            var expires = "; expires=" + date.toUTCString();
            document.cookie = "user_id=" + data.user_id + expires + "; path=/";
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
