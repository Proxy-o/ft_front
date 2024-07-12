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
  let res;
  try {
    res = await axiosInstance.post("game/send_invitation", {
      sender: user_id,
      receiver: userid,
      gameType: gameType,
    });
    if (res !== res) throw new Error("Failed to send invitation to user");
  } catch (error: any) {
    toast.error(error?.response?.data.error);
    return "";
  }
  return userid;
};

export default function useSendInvitation() {
  const { handelSendInvitation } = useInvitationSocket();
  const mutation = useMutation({
    mutationFn: invite,
    onSuccess: (userid) => {
      if (userid === "") return;
      handelSendInvitation(userid);
      toast.success("Invitation sent");
    },
  });
  return mutation;
}
