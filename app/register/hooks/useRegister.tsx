import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "@/lib/providers/UserContext";
import { toast } from "sonner";
// login hook
export default function useRegister() {
  const router = useRouter();
  const { setCurrentUser } = useContext(UserContext);
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
    },
    onError: (error) => {
      console.log(error);
      if ((error as any).response.data.username) {
        toast.error((error as any).response.data.username);
      } else if ((error as any).response.data.email) {
        toast.error((error as any).response.data.email);
      } else {
        toast.error("Error creating account");
      }
    },
  });
  return mutation;
}
