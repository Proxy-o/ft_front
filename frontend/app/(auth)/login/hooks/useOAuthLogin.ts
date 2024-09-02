import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation } from "@tanstack/react-query";

const useOAuthLogin = () => {
  const mutation = useMutation({
    mutationFn: async (provider : string) => {
      try {
        const response = await axiosInstance.get<{ redirect_url: string }>(`/redirect/${provider}`);
        window.location.href = response.data.redirect_url;
      } catch (error: any) {
        throw new Error(error.response?.data?.detail || 'An error occurred during OAuth login');
      }
    },
  });

  return mutation;
};

export default useOAuthLogin;
