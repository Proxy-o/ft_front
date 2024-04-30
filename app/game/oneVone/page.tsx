"use client";

import Two from "./two";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useGetUser from "@/app/profile/hooks/useGetUser";
import getCookie from "@/lib/functions/getCookie";
import useGameSocket from "@/lib/hooks/useGameSocket";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import Invitations from "../components/invitations";
import InviteFriends from "../components/inviteFriend";

export default function Page() {
  const user_id = getCookie("user_id") || "";
  const { data: user, isSuccess } = useGetUser(user_id || "0");
  const router = useRouter();
  const { newNotif } = useGameSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user && isSuccess) {
      router.push("/login");
    }
  }, [user, isSuccess, router]);

  useEffect(() => {
    const notif = newNotif();
    if (notif) {
      const parsedMessage = JSON.parse(notif.data);
      const message = parsedMessage?.message.split(" ");
      if (message[0] === "/start") {
        queryClient.invalidateQueries({ queryKey: ["game"] });
        toast.success("The game has started");
      }
    }
  }, [newNotif()?.data]);

  return (
    <div className={`flex flex-col w-full h-full justify-start items-center`}>
      <Card className="w-11/12 max-w-[900px] h-fit flex flex-col justify-center items-start p-2 pb-8 mx-auto mt-12 gap-2">
        <div className="w-full">
          <Two type="two" />
        </div>
        <div className="w-full h-full flex flex-col md:flex-row justify-start items-start p-2 gap-4">
          <div className="w-full md:w-1/2 h-full flex flex-col justify-start items-start gap-2">
            <Invitations mode="two" />
          </div>
          <div className="w-full md:w-1/2 h-full gap-2">
            <InviteFriends gameType="two" />
          </div>
        </div>
      </Card>
    </div>
  );
}
