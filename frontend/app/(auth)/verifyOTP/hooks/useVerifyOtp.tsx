import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { VerifyOTPState } from "../types";
import { useRouter } from "next/navigation";
import { setCookie } from "@/lib/functions/getCookie";

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
      toast.success("OTP verified successfully.");
      setCookie("logged_in", "yes", 1);
      route.push("/");
    },
    onError: (err) => {
      toast.error("Invalid OTP. Please try again.");
    },
  });
  return info;
}
