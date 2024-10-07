import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/lib/functions/axiosInstance';
import { useRouter } from 'next/navigation';
import { setCookie } from '@/lib/functions/getCookie';
import type { OAuthCallbackParams } from '@/lib/types';
import { toast } from 'sonner';

const useOAuthCallback = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ provider, code, state }: OAuthCallbackParams) => {
      if (!provider || !code || !state) {
        throw Error("Error: can't process authentification: missing params")
      }
      try {
        const response = await axiosInstance.get(`/callback/${provider}`, {
          params: { code, state },
        });
        return response.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.detail || "An error occurred during login");
      }
    },
    onSuccess: (data) => {
      if (!data) {
        router.push("/login");
        return ;
      }
      if (data.detail === "2FA required") {
        router.push("/verifyOTP?user_id=" + data.user_id);
        return ;
      }
      setCookie('logged_in', 'yes');
      router.push("/game");
    },
    onError: (error) => {
      toast.error(error.message)
      router.push("/login")
      return;
    }
  });
};

export default useOAuthCallback;
