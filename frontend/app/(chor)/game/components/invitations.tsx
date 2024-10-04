"use client";

import React, { useEffect } from "react";
import { Check, Inbox, X } from "lucide-react";
import useGetInvitations from "../hooks/useGetInvitations";
import useDeclineInvitation from "../hooks/useDeclineMutation";
import useAcceptInvitation from "../hooks/useAccepteInvitation";
import { Invitation } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAcceptInvitationTournament from "../hooks/useAccepteInvitationTournament";
import { Card } from "@/components/ui/card";
import { usePathname, useRouter } from "next/navigation";
import useInvitationSocket from "@/app/(chor)/game/hooks/sockets/useInvitationSocket";
import { toast } from "sonner";
import useGetUser from "../../profile/hooks/useGetUser";

const Invitations = ({ mode }: { mode: string }) => {
  const { newNotif } = useInvitationSocket();
  const { data: user } = useGetUser("0");
  const user_id = user?.id; // todo: replace cookie user_id with user.id
  const router = useRouter();
  let invitationsData = useGetInvitations(user_id || "0");
  const { mutate: declineMutation } = useDeclineInvitation();
  const { mutate: acceptInvitationMutation } = useAcceptInvitation();
  const { mutate: acceptInvitationTournamentMutation } =
    useAcceptInvitationTournament();
  const path = usePathname();
  const invitations: Invitation[] = invitationsData.data
    ? invitationsData.data
    : [];

  const acceptInvitation = async (invitationId: string) => {
    try {
      await acceptInvitationMutation(invitationId);
    } catch (error) {
      // console.log(error);
    }
  };

  const acceptInvitationTournament = (invitationId: string) => {
    try {
      acceptInvitationTournamentMutation(invitationId);
    } catch (error) {
      // console.log(error);
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
  }, [invitationsData, newNotif]);

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
  }
  return (
    <Card
      className={`w-full h-fit max-h-[50vw] flex flex-col p-2 overflow-hidden ${
        (path === "/game/oneVone" || path === "/game/twoVtwo") &&
        "md:aspect-[2]"
      }`}
    >
      <div className="w-full h-fit flex flex-col justify-start items-center mx-auto gap-2 overflow-hidden">
        <div className="w-full h-fit text-center text-lg font-bold">
          Invitations
        </div>
        <div className="w-full h-fit max-h-[50vw] flex flex-col items-center justify-start gap-2 overflow-auto">
          {((mode === "all" && invitations.length === 0) ||
            (mode === "tournament" && tournamentInvitations.length === 0) ||
            (mode === "four" && twoVsTwoInvitations.length === 0) ||
            (mode === "two" && oneVsOneInvitations.length === 0)) && (
            <div className="flex flex-row w-full justify-center items-center gap-2 text-primary border-t p-2">
              <Inbox size={30} />
              No invitations
            </div>
          )}
          {oneVsOneInvitations.length !== 0 ? (
            <>
              {oneVsOneInvitations.map((invitation, index) => {
                return (
                  <div
                    key={invitation.id}
                    className="w-full mr-auto pt-2 border-t"
                  >
                    <div className="flex flex-row justify-between items-center mx-auto gap-2 w-10/12">
                      <div className="flex flex-row justify-start items-center gap-2 w-full">
                        <Avatar className=" mr-2">
                          <AvatarImage
                            src={invitation.sender.avatar}
                            alt="profile image"
                            className="rounded-md h-8 w-8"
                          />
                          <AvatarFallback className="rounded-md">
                            PF
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="flex flex-row justify-end items-center gap-2">
                        {path == "/game/oneVone" ? (
                          <>
                            <Button
                              // className="rounded-md bg-primary hover:bg-secondary hover:text-primary hover:border-primary border-2  border-primary mr-2"
                              size={"xs"}
                              onClick={() => {
                                acceptInvitation(invitation.id);
                              }}
                            >
                              <Check size={20} />
                            </Button>
                            <Button
                              variant={"secondary"}
                              size={"xs"}
                              onClick={() => declineMutation(invitation.id)}
                            >
                              <X size={20} />
                            </Button>
                          </>
                        ) : (
                          <Button
                            // className="rounded-md bg-primary hover:bg-secondary hover:text-primary hover:border-primary border-2  border-primary mr-2"
                            size={"sm"}
                            onClick={() => {
                              router.push("/game/oneVone");
                            }}
                          >
                            1 VS 1
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : null}
          {twoVsTwoInvitations.length !== 0 ? (
            <>
              {twoVsTwoInvitations.map((invitation) => {
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
                          <AvatarFallback className="rounded-md">
                            PF
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex flex-row justify-end items-center gap-2">
                        {path == "/game/twoVtwo" ? (
                          <>
                            <Button
                              // className="rounded-md bg-primary hover:bg-secondary hover:text-primary hover:border-primary border-2  border-primary mr-2"
                              size={"sm"}
                              onClick={() => {
                                acceptInvitation(invitation.id);
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
                          </>
                        ) : (
                          <Button
                            // className="rounded-md bg-primary hover:bg-secondary hover:text-primary hover:border-primary border-2  border-primary mr-2"

                            size={"sm"}
                            onClick={() => {
                              router.push("/game/twoVtwo");
                            }}
                          >
                            2 VS 2
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : null}
          {tournamentInvitations.length !== 0 ? (
            <>
              {tournamentInvitations.map((invitation) => {
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
                          <AvatarFallback className="rounded-md">
                            PF
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex flex-row justify-end items-center gap-2">
                        {path == "/game/tournament" ? (
                          <>
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
                          </>
                        ) : (
                          <Button
                            // className="rounded-md bg-primary hover:bg-secondary hover:text-primary hover:border-primary border-2  border-primary mr-2"

                            size={"sm"}
                            onClick={() => {
                              router.push("/game/tournament");
                            }}
                          >
                            Tournament
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          ) : null}
        </div>
      </div>
    </Card>
  );
};

export default Invitations;
