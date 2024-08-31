import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { setCookie } from '@//lib/functions/getCookie';
import { LoginParams, LoginResponse } from '@/lib/types';

const useLogin = () => {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: LoginParams) => {
      try {
        const response = await axiosInstance.post<LoginResponse>("/login", data);
        return response.data;
      } catch (error: any) {
        if (error.response) {
          const responseData = error.response.data;
          if (responseData.detail === "2FA required") {
            setCookie('user_id', responseData.user_id);
            router.push("/verifyOTP");
            return;
          }
        }
        throw new Error(error.response?.data?.detail || "An error occurred during login");
      }
    },
    onSuccess: (data) => {
      if (!data) {
        router.push("/login");
        return;
      }
      setCookie('logged_in', 'yes');
      setCookie('user_id', data.user.id);
      router.push("/");
    },
  });

  return mutation;
};

export default useLogin;
