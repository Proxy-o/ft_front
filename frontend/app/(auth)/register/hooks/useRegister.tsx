import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// login hook
export default function useRegister() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (data: {
      username: string;
      email: string;
      password: string;
    }) => {
      const response = await axiosInstance.post("/signup", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Account created successfully");
      router.push("/login");
      return;
    },
    onError: (error) => {
      console.log("hhhelo")
      if ((error as any).response.data.username) {
        toast.error((error as any).response.data.username);
      } else if ((error as any).response.data.email) {
        toast.error((error as any).response.data.email);
      } else if ((error as any).response.data.password ) {
        toast.error((error as any).response.data.password[0]);
      }
      else {
        toast.error("Something went wrong");
      }
    },
  });
  return mutation;
}
