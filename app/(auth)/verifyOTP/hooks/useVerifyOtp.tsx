import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { VerifyOTPState } from "../types";
import { useRouter } from "next/navigation";
import { setLoginCookie } from "@/app/(auth)/login/hooks/useLogin";

const verifyOtp = async (data: VerifyOTPState) => {
  try {
    const response = await axiosInstance.post(`/verify_otp`, data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status !== 401) {
      throw new Error(error.response.data.message);
    }
  }
};

export default function useVerifyOtp() {
  const route = useRouter();
  const info = useMutation({
    mutationFn: async (data: VerifyOTPState) => {
      const res = await verifyOtp(data);
      return res;
    },
    onSuccess: (data) => {
      setLoginCookie(data);
      route.push("/");
    },
    onError: (err) => {
      toast.error("Invalid OTP. Please try again.");
    },
  });
  return info;
}
