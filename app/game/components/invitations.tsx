import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Inbox, Swords } from "lucide-react";
import { CircleOff } from "lucide-react";
import useGameSocket from "@/lib/hooks/useGameSocket";
import useGetInvitations from "../hooks/useGetInvitations";
import useDeclineInvitation from "../hooks/useDeclineMutation";
import useAcceptInvitation from "../hooks/useAccepteInvitation";
import getCookie from "@/lib/functions/getCookie";
import { Invitation } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import useAcceptInvitationTournament from "../hooks/useAccepteInvitationTournament";
import { Card } from "@/components/ui/card";

const Invitations = ({
  setTab,
}: {
  setTab: Dispatch<SetStateAction<string>>;
}) => {
  const { newNotif, handleAcceptInvitation } = useGameSocket();
  const user_id = getCookie("user_id") || "";

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

  const acceptInvitationTournament = async (invitationId: string) => {
    try {
      await acceptInvitationTournamentMutation(invitationId);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    invitationsData.refetch();
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

  return (
    <div className="w-full flex flex-col justify-start items-start space-y-2">
      {oneVsOneInvitations.length !== 0 ? (
        <>
          <Card className="w-full h-full flex flex-col justify-start items-start p-2 mx-auto gap-2 bg-background">
            <h1 className="text-4xl mx-auto">1 vs 1</h1>
            <Separator className="w-full my-4" />
            {oneVsOneInvitations.map((invitation) => {
              const date = new Date(invitation.timestamp);
              return (
                <div
                  key={invitation.id}
                  className="border-2 border-secondary rounded-full hover:bg-secondary/60 w-11/12 mr-auto"
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
                      onClick={() => {
                        acceptInvitation(invitation.id);
                        setTab("two");
                      }}
                    >
                      <Swords size={20} />
                    </Button>
                    <Button
                      className="rounded-xl bg-secondary hover:bg-background mr-auto"
                      size={"sm"}
                      onClick={() => declineMutation(invitation.id)}
                    >
                      <CircleOff size={20} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </Card>
        </>
      ) : null}

      {twoVsTwoInvitations.length !== 0 ? (
        <>
          <Card className="w-full h-full flex flex-col justify-start items-start p-2 mx-auto gap-2 bg-background">
            <h1 className="text-4xl mx-auto">2 vs 2</h1>
            <Separator className="w-full my-4" />
            {twoVsTwoInvitations.map((invitation) => {
              const date = new Date(invitation.timestamp);
              return (
                <div
                  key={invitation.id}
                  className="border-2 border-secondary rounded-full hover:bg-secondary/60 w-11/12 mr-auto"
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
                      onClick={() => {
                        acceptInvitation(invitation.id);
                        setTab("four");
                      }}
                    >
                      <Swords size={20} />
                    </Button>
                    <Button
                      className="rounded-xl bg-secondary hover:bg-background mr-auto"
                      size={"sm"}
                      onClick={() => declineMutation(invitation.id)}
                    >
                      <CircleOff size={20} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </Card>
        </>
      ) : null}

      {tournamentInvitations.length !== 0 ? (
        <>
          <Card className="w-full h-full flex flex-col justify-start items-start p-2 mx-auto gap-2 bg-background">
            <h1 className="text-4xl mx-auto">Tournament</h1>
            <Separator className="w-full my-4" />
            {tournamentInvitations.map((invitation) => {
              const date = new Date(invitation.timestamp);
              return (
                <div
                  key={invitation.id}
                  className="border-2 border-secondary rounded-full hover:bg-secondary/60 w-11/12 mr-auto"
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
                      onClick={() => {
                        acceptInvitationTournament(invitation.id);
                        setTab("tournament");
                      }}
                    >
                      <Swords size={20} />
                    </Button>
                    <Button
                      className="rounded-xl bg-secondary hover:bg-background mr-auto"
                      size={"sm"}
                      onClick={() => declineMutation(invitation.id)}
                    >
                      <CircleOff size={20} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </Card>
        </>
      ) : null}

      {invitations.length === 0 && (
        <h1 className="flex gap-2 text-md mt-2 ml-4 text-primary/70">
          <Inbox />
          No invitations
        </h1>
      )}
    </div>
  );
};

export default Invitations;
