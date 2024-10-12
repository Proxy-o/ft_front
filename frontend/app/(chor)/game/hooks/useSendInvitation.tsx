import axiosInstance from "@/lib/functions/axiosInstance";
import useInvitationSocket from "@/app/(chor)/game/hooks/sockets/useInvitationSocket";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const invite = async ({
  userid,
  gameType,
  user_id,
}: {
  userid: string;
  gameType: string;
  user_id: string;
}) => {
  let res;
  // console.log("user_id zbbi");
  try {
    res = await axiosInstance.post("game/send_invitation", {
      sender: user_id,
      receiver: userid,
      gameType: gameType,
    });
    if (res !== res) throw new Error("Failed to send invitation to user");
  } catch (error: any) {
    toast.error(error?.response?.data.error);
    return { userid: "", gameType: "", user_id: "" };
  }
  return { userid, gameType, user_id };
};

export default function useSendInvitation() {
  const { handelSendInvitation } = useInvitationSocket();
  const mutation = useMutation({
    mutationFn: ({
      userid,
      gameType,
      user_id,
    }: {
      userid: string;
      gameType: string;
      user_id: string;
    }) => invite({ userid, gameType, user_id }),
    onSuccess: ({ userid, gameType }: { userid: string; gameType: string }) => {
      if (userid === "") return;
      handelSendInvitation(userid, gameType);
      toast.success("Invitation sent");
    },
  });
  return mutation;
}
