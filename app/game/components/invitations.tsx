"use client";

import { Inbox, Swords } from "lucide-react";
import { CircleOff } from "lucide-react";
import useGameSocket from "@/lib/hooks/useGameSocket";
import { Dispatch, SetStateAction, useEffect } from "react";
import useGetInvitations from "../hooks/useGetInvitations";
import useDeclineInvitation from "../hooks/useDeclineMutation";
import useAcceptInvitation from "../hooks/useAccepteInvitation";
import getCookie from "@/lib/functions/getCookie";
import { Invitation } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

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
    <div className="w-full flex flex-col justify-start items-start space-y-2">
      <h1 className="text-4xl">Challenges</h1>
      <Separator className="w-full my-4" />
      {invitations && invitations.length !== 0 ? (
        invitations.map((invitation) => {
          const date = new Date(invitation.timestamp);
          return (
            <div
              key={invitation.id}
              className={
                invitation.is_accepted === false
                  ? ""
                  : "border-2 border-secondary rounded-full hover:bg-secondary/60 w-11/12 mr-auto"
              }
            >
              <div className="flex flex-row justify-start items-center my-2 mx-auto gap-2">
                <Avatar className=" mr-2 ml-auto">
                  <AvatarImage
                    src={invitation.sender.avatar}
                    alt="profile image"
                    className="rounded-xl h-8 w-8"
                  />
                  <AvatarFallback className="rounded-xl">PF</AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-start items-start ml-2">
                  <h1>{invitation.sender.username}</h1>
                  <p className="text-xs text-primary/70">
                    {date.toLocaleString()}
                  </p>
                </div>
                <Button
                  className="rounded-xl"
                  size={"sm"}
                  onClick={async () => {
                    await acceptInvitation(invitation.id);
                  }}
                >
                  <Swords size={20} />
                </Button>
                <Button
                  className="rounded-xl bg-secondary hover:bg-background mr-auto"
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
        <>
          <h1 className="flex gap-2 text-md mt-2 ml-4 text-primary/70">
            <Inbox />
            No invitations
          </h1>
        </>
      )}
    </div>
  );
};

export default Invitations;
