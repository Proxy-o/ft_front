"use client";

import React, { useEffect } from "react";
import { Inbox } from "lucide-react";
import useGetInvitations from "../../hooks/invitations/useGetInvitations";
import { Card } from "@/components/ui/card";
import { usePathname } from "next/navigation";
import useInvitationSocket from "@/app/(chor)/game/hooks/sockets/useInvitationSocket";
import { toast } from "sonner";
import useGetUser from "../../../profile/hooks/useGetUser";
import { t_Invitation } from "@/lib/types";
import Invitation from "./invitation";

const Invitations = ({ mode }: { mode: string }) => {
  const { newNotif } = useInvitationSocket();
  const { data: user } = useGetUser("0");
  const user_id = user?.id;
  let { data: invitations, refetch } = useGetInvitations(user_id || "0");

  const path = usePathname();

  useEffect(() => {
    const notif = newNotif();
    if (notif) {
      const parsedMessage = JSON.parse(notif.data);
      const message = parsedMessage?.message.split(" ");
      if (message[0] === "/notif") {
        refetch();
      } else if (message[0] === "/decline") {
        toast.error(message[1] + " has declined your invitation");
      }
    }
  }, [invitations, newNotif]);

  if (!invitations) invitations = [];

  return (
    <Card
      className={`w-full h-fit max-h-[50vw] flex flex-col p-2 overflow-hiddenw-full justify-start items-center mx-auto gap-2 overflow-hidden ${
        (path === "/game/oneVone" || path === "/game/twoVtwo") &&
        "md:aspect-[2]"
      }`}
    >
      Invitations
      <div className="w-full h-fit max-h-[50vw] flex flex-col items-center justify-start gap-2 overflow-auto">
        {(invitations.length === 0 && (
          <div className="flex flex-row w-full justify-center items-center gap-2 text-primary border-t p-2">
            <Inbox size={30} />
            No invitations
          </div>
        )) || (
          <div className="w-full h-fit max-h-[50vw] flex flex-col items-center justify-start gap-2 overflow-auto">
            {invitations.map((invitation: t_Invitation) => {
              return (
                ((path === "/game/oneVone" && invitation.type === "two") ||
                  (path === "/game/twoVtwo" && invitation.type === "four") ||
                  path === "/game") && (
                  <Invitation key={invitation.id} invitation={invitation} />
                )
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};

export default Invitations;
