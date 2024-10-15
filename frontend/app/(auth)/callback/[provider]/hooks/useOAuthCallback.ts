import { useMutation } from '@tanstack/react-query';
import axiosInstance from '@/lib/functions/axiosInstance';
import { useRouter } from 'next/navigation';
import { setCookie } from '@/lib/functions/getCookie';
import type { OAuthCallbackParams } from '@/lib/types';
import { toast } from 'sonner';

const ERROR_MESSAGES = {
  missingParams: "Error: can't process authentication: missing params",
  loginError: "An error occurred during login",
};

const ROUTES = {
  login: "/login",
  verifyOTP: "/verifyOTP",
  game: "/game",
};

const useOAuthCallback = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ provider, code, state }: OAuthCallbackParams) => {
      if (!provider || !code || !state) {
        throw new Error(ERROR_MESSAGES.missingParams);
      }
      try {
        const response = await axiosInstance.get(`/callback/${provider}`, {
          params: { code, state },
        });
        return response.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.detail || ERROR_MESSAGES.loginError);
      }
    },
    onSuccess: (data) => {
      if (!data) {
        router.push(ROUTES.login);
        return;
      }
      if (data.detail === "2FA required") {
        router.push(`${ROUTES.verifyOTP}?user_id=${data.user_id}`);
        return;
      }
      setCookie('logged_in', 'yes');
      router.push(ROUTES.game);
      return;
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export default useOAuthCallback;