import axiosInstance from "@/lib/functions/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "@/lib/providers/UserContext";
import { AxiosError } from "axios";
import { toast } from "sonner";
// login hook
export default function useLogin() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await axiosInstance.post("/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      var date = new Date();
      date.setTime(date.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
      var expires = "; expires=" + date.toUTCString();
      // add same site and secure
      document.cookie =
        "access=" +
        data.access +
        expires +
        "; path=/" +
        "; samesite=strict; secure";
      document.cookie =
        "refresh=" +
        data.refresh +
        expires +
        "; path=/" +
        "; samesite=strict; secure";
      document.cookie =
        "logged_in=yes" + expires + "; path=/" + "; samesite=strict; secure";
      document.cookie =
        "user_id=" +
        data.user.id +
        expires +
        "; path=/" +
        "; samesite=strict; secure";
      router.push("/");
    },
  });
  return mutation;
}
