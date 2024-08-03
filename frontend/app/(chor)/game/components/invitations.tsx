"use client";

import React, { useEffect } from "react";
import { Check, X } from "lucide-react";
import useGetInvitations from "../hooks/useGetInvitations";
import useDeclineInvitation from "../hooks/useDeclineMutation";
import useAcceptInvitation from "../hooks/useAccepteInvitation";
import getCookie from "@/lib/functions/getCookie";
import { Invitation } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import useAcceptInvitationTournament from "../hooks/useAccepteInvitationTournament";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import useInvitationSocket from "@/app/(chor)/game/hooks/useInvitationSocket";
import { toast } from "sonner";

const Invitations = ({ mode }: { mode: string }) => {
  const { newNotif } = useInvitationSocket();
  const user_id = getCookie("user_id") || "";
  const router = useRouter();
  let invitationsData = useGetInvitations(user_id || "0");
  const { mutate: declineMutation } = useDeclineInvitation();
  const { mutate: acceptInvitationMutation } = useAcceptInvitation();
  const { mutate: acceptInvitationTournamentMutation } =
    useAcceptInvitationTournament();
  const invitations: Invitation[] = invitationsData.data
    ? invitationsData.data
    : [];

  const acceptInvitation = async (invitationId: string) => {
    try {
      await acceptInvitationMutation(invitationId);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptInvitationTournament = (invitationId: string) => {
    try {
      acceptInvitationTournamentMutation(invitationId);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const notif = newNotif();
    if (notif) {
      const parsedMessage = JSON.parse(notif.data);
      const message = parsedMessage?.message.split(" ");
      if (message[0] === "/notif") {
        invitationsData.refetch();
      } else if (message[0] === "/decline") {
        toast.error(message[1] + " has declined your invitation");
      }
    }
  }, [newNotif()?.data]);

  // Separate invitations by type
  const oneVsOneInvitations = invitations.filter(
    (invitation) => invitation.type === "two"
  );
  const twoVsTwoInvitations = invitations.filter(
    (invitation) => invitation.type === "four"
  );
  const tournamentInvitations = invitations.filter(
    (invitation) => invitation.type === "tournament"
  );

  if (mode !== "all") {
    if (mode === "two") {
      twoVsTwoInvitations.length = 0;
      tournamentInvitations.length = 0;
    } else if (mode === "four") {
      oneVsOneInvitations.length = 0;
      tournamentInvitations.length = 0;
    } else if (mode === "tournament") {
      oneVsOneInvitations.length = 0;
      twoVsTwoInvitations.length = 0;
    }
  } else {
    if (invitations.length === 0) {
      return (<div className="w-full h-full flex flex-col justify-center items-center mx-auto gap-2">
        <h1 className="text-4xl mx-auto w-full text-start">
          No invitations
        </h1>
      </div>);
    }
  }
  return (
    <div className="w-full  h-full flex flex-col justify-start items-center mx-auto gap-2">
      <div className="w-full flex flex-col justify-center items-center  space-y-2">
        <Card className="w-full flex flex-col p-2">
        {mode !== "all" && (
          <h1 className="text-4xl mx-auto w-full text-start">
            Invitations
          </h1>
        )}
        {oneVsOneInvitations.length !== 0 ? (
          <>
            <h1 className="text-xl mx-auto pb-2">1 vs 1</h1>
            {oneVsOneInvitations.map((invitation,index) => {
              const date = new Date(invitation.timestamp);
              return (
                <div
                key={invitation.id}
                className="w-full mr-auto p-2 border-t"
                >
                  <div className="flex flex-row justify-between items-center mx-auto gap-2 w-10/12">
                    <div className="flex flex-row justify-start items-center gap-2">

                    <Avatar className=" mr-2">
                      <AvatarImage
                        src={invitation.sender.avatar}
                        alt="profile image"
                        className="rounded-md h-8 w-8"
                        />
                      <AvatarFallback className="rounded-md">PF</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col justify-start items-start ml-2">
                      <h1>{invitation.sender.username}</h1>
                      <p className="text-xs text-primary/70">
                        {date.getHours()}:{date.getMinutes()}
                      </p>
                    </div>
                        </div>
                        <div className="flex flex-row justify-end items-center gap-2">
                          
                    <Button
                      // className="rounded-md bg-primary hover:bg-secondary hover:text-primary hover:border-primary border-2  border-primary mr-2"
                      size={"sm"}
                      onClick={() => {
                        acceptInvitation(invitation.id);
                        router.push("/game/oneVone");
                      }}
                      >
                      <Check size={20} />
                    </Button>
                    <Button
                      variant={"secondary"}
                      size={"sm"}
                      onClick={() => declineMutation(invitation.id)}
                      >
                      <X size={20} />
                    </Button>
                      </div>
                  </div>
                </div>
              );
            })}
            </>
        ) : null}
        {twoVsTwoInvitations.length !== 0 ? (
          <>
            <h1 className="text-xl mx-auto pb-2">2 vs 2</h1>
            {twoVsTwoInvitations.map((invitation) => {
              const date = new Date(invitation.timestamp);
              return (
                <div
                key={invitation.id}
                className="gap-2 w-full mr-auto p-2 border-t"
                >
                  <div className="flex flex-row justify-between items-center mx-auto gap-2 w-10/12">
                    <div className="flex flex-row justify-start items-center gap-2">
                      <Avatar className=" mr-2">
                        <AvatarImage
                          src={invitation.sender.avatar}
                          alt="profile image"
                          className="rounded-md h-8 w-8"
                          />
                        <AvatarFallback className="rounded-md">PF</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col justify-start items-start ml-2">
                        <h1>{invitation.sender.username}</h1>
                        <p className="text-xs text-primary/70">
                          {date.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row justify-end items-center gap-2">
                      <Button
                        // className="rounded-md bg-primary hover:bg-secondary hover:text-primary hover:border-primary border-2  border-primary mr-2"
                        size={"sm"}
                        onClick={() => {
                          acceptInvitation(invitation.id);
                          router.push("/game/twoVtwo");
                        }}
                        >
                        <Check size={20} />
                      </Button>
                      <Button
                        variant={"secondary"}
                        size={"sm"}
                        onClick={() => declineMutation(invitation.id)}
                        >
                        <X size={20} />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
        </>
        ) : null}
        {tournamentInvitations.length !== 0 ? (
        <>
        <h1 className="text-xl mx-auto pb-2">Tournament</h1>
          {tournamentInvitations.map((invitation) => {
            const date = new Date(invitation.timestamp);
            return (
              <div
              key={invitation.id}
              className="gap-2 w-full mr-auto p-2  border-t"
              >
                  <div className="flex flex-row justify-between items-center my-2 mx-auto gap-2 w-10/12">
                    <div className="flex flex-row justify-start items-center gap-2">
                      <Avatar className=" mr-2">
                        <AvatarImage
                          src={invitation.sender.avatar}
                          alt="profile image"
                          className="rounded-md h-8 w-8"
                          />
                        <AvatarFallback className="rounded-md">PF</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col justify-start items-start ml-2">
                        <h1>{invitation.sender.username}</h1>
                        <p className="text-xs text-primary/70">
                          {date.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-row justify-end items-center gap-2">
                      <Button
                        // className="rounded-md bg-primary hover:bg-secondary hover:text-primary hover:border-primary border-2  border-primary mr-2"
                        size={"sm"}
                        onClick={() => {
                          acceptInvitationTournament(invitation.id);
                          router.push("/game/tournament");
                        }}
                        >
                        <Check size={20} />
                      </Button>
                      <Button
                        variant={"secondary"}
                        size={"sm"}
                        onClick={() => declineMutation(invitation.id)}
                        >
                        <X size={20} />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
          ) : null}
          </Card>
      </div>
    </div>
  );
}

export default Invitations;