"use client";

import { Swords } from "lucide-react";
import { CircleOff } from "lucide-react";
import useGameSocket from "@/lib/hooks/useGameSocket";
import { Dispatch, SetStateAction, useEffect } from "react";
import useGetInvitations from "../hooks/useGetInvitations";
import useDeclineInvitation from "../hooks/useDeclineMutation";
import useAcceptInvitation from "../hooks/useAccepteInvitation";
import getCookie from "@/lib/functions/getCookie";
import { Invitation } from "@/lib/types";
import { Button } from "@/components/ui/button";

const Invitations = ({
  setTab,
}: {
  setTab: Dispatch<SetStateAction<string>>;
}) => {
  const { newNotif, handleAcceptInvitation } = useGameSocket();
  const user_id = getCookie("user_id") || "";

  let invitaionsData = useGetInvitations(user_id || "0");
  const { mutate: declineMutation } = useDeclineInvitation();
  const { mutate: acceptInvitationMutation } = useAcceptInvitation({ setTab });
  const invitations: Invitation[] = invitaionsData.data
    ? invitaionsData.data
    : [];

  const acceptInvitation = async (invitationId: string) => {
    try {
      acceptInvitationMutation(invitationId);
      handleAcceptInvitation(invitationId);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    invitaionsData.refetch();
  }, [newNotif()?.data]);

  return (
    <div className="w-full flex flex-col justify-start items-start">
      <h1 className="text-4xl">Challenges</h1>
      {invitations && invitations.length !== 0 ? (
        invitations.map((invitation) => {
          const date = new Date(invitation.timestamp);
          return (
            <div
              key={invitation.id}
              className={invitation.is_accepted === false ? "hidden" : ""}
            >
              <div className="flex flex-row justify-start items-center mt-5 ml-10 gap-2">
                <img
                  src={invitation.sender.avatar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex flex-col justify-start items-start ml-2">
                  <h1>{invitation.sender.username}</h1>
                  <p className="text-xs">{date.toLocaleString()}</p>
                </div>
                <Button
                  size={"sm"}
                  onClick={async () => {
                    await acceptInvitation(invitation.id);
                  }}
                >
                  <Swords size={20} />
                </Button>
                <Button
                  size={"sm"}
                  onClick={async () => await declineMutation(invitation.id)}
                >
                  <CircleOff size={20} />
                </Button>
              </div>
            </div>
          );
        })
      ) : (
        <h1 className="text-md mt-2 ml-4 text-primary">No invitations</h1>
      )}
    </div>
  );
};

export default Invitations;
