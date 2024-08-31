import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/lib/functions/axiosInstance';
import { useRouter } from 'next/navigation';
import { setCookie } from '@/lib/functions/getCookie';
import { OAuthCallbackParams, OAuthCallbackResponse } from '@/lib/types';

const useOAuthCallback = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ provider, code, state }: OAuthCallbackParams) => {
      try {
        const response = await axiosInstance.get<OAuthCallbackResponse>(`/callback/${provider}`, {
          params: { code, state },
        });
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
        if (!data || !data.user) {
          router.push("/login");
          return;
        }
        setCookie('logged_in', 'yes');
        setCookie('user_id', data.user.id);
        router.push("/");
    },
  });
};

export default useOAuthCallback;
