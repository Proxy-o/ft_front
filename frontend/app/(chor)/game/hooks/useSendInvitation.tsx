import axiosInstance from "@/lib/functions/axiosInstance";
import getCookie from "@/lib/functions/getCookie";
import useInvitationSocket from "@/lib/hooks/useInvitationSocket";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

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
  } else if (gameType === "tournament") {
    try {
      const res = await axiosInstance.post("game/send_invitation", {
        sender: user_id,
        receiver: userid,
        gameType: "tournament",
      });
      if (res.status === 201) {
      }
    } catch (error) {
      console.log(error);
    }
  }
  return userid;
};

export default function useSendInvitation() {
  const { handelSendInvitation } = useInvitationSocket();
  const mutation = useMutation({
    mutationFn: invite,
    onSuccess: (userid) => {
      handelSendInvitation(userid);
      toast.success("Invitation sent");
    },
  });
  return mutation;
}
