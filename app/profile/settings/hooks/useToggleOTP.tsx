import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const toggleOTP = async (status: "enable" | "disable") => {
  try {
    const response = await axiosInstance.post(`/toggle_otp`, { status });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status !== 401) {
      throw new Error(error.response.data.message);
    }
  }
};

export default function useToggleOTP(id: string) {
  const queryClient = useQueryClient();
  const info = useMutation({
    mutationFn: async (status: "enable" | "disable") => {
      const res = await toggleOTP(status);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`user`, id],
      });
      toast.success("The status of OTP has been successfully");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  return info;
}
