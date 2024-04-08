import axiosInstance from "@/lib/functions/axiosInstance";
import getCookie from "@/lib/functions/getCookie";
import { useMutation } from "@tanstack/react-query";

const user_id = getCookie("user_id") || "";

const invite = async ({
  userid,
  gameType,
}: {
  userid: string;
  gameType: string;
}) => {
  if (gameType === "two") {
    try {
      const res = await axiosInstance.post("game/send_invitation", {
        sender: user_id,
        receiver: userid,
        gameType: "two",
      });
      if (res.status === 201) {
      }
    } catch (error) {
      console.log(error);
    }
  } else if (gameType === "four") {
    try {
      const res = await axiosInstance.post("game/send_invitation", {
        sender: user_id,
        receiver: userid,
        gameType: "four",
      });
      if (res.status === 201) {
      }
    } catch (error) {
      console.log(error);
    }
  }
};

export default function useSendInvitation() {
  const mutation = useMutation({
    mutationFn: invite,
    onSuccess: () => {},
  });
  return mutation;
}
