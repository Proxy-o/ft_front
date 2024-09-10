import axiosInstance from "@/lib/functions/axiosInstance";
import getCookie from "@/lib/functions/getCookie";
import useInvitationSocket from "@/app/(chor)/game/hooks/sockets/useInvitationSocket";
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
  console.log("user_id zbbi");
  try {
    res = await axiosInstance.post("game/send_invitation", {
      sender: user_id,
      receiver: userid,
      gameType: gameType,
    });
    if (res !== res) throw new Error("Failed to send invitation to user");
  } catch (error: any) {
    toast.error(error?.response?.data.error);
    return { userid: "", gameType: "" };
  }
  return { userid, gameType };
};

export default function useSendInvitation() {
  const { handelSendInvitation } = useInvitationSocket();
  const mutation = useMutation({
    mutationFn: invite,
    onSuccess: ({ userid, gameType }: { userid: string; gameType: string }) => {
      if (userid === "") return;
      handelSendInvitation(userid, gameType);
      toast.success("Invitation sent");
    },
  });
  return mutation;
}
