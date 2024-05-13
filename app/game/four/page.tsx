"use client";

import getCookie from "@/lib/functions/getCookie";
import Four from "./four";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useGetUser from "@/app/profile/hooks/useGetUser";
import { Card } from "@/components/ui/card";
import Invitations from "../components/invitations";
import InviteFriends from "../components/inviteFriend";

export default function Page() {
  const user_id = getCookie("user_id") || "";
  const { data: user, isSuccess } = useGetUser(user_id || "0");
  const router = useRouter();

  useEffect(() => {
    if (!user && isSuccess) {
      router.push("/login");
    }
  }, [user, isSuccess, router]);

  return (
    <div className={`flex flex-col w-full h-full justify-start items-center`}>
      <Card className="w-11/12 max-w-[900px] h-fit flex flex-col justify-center items-start p-2 pb-8 mx-auto mt-12 gap-2">
        <div className="w-full">
          <Four />
        </div>
        <div className="w-full h-full flex flex-col md:flex-row justify-start items-start p-2 gap-4">
          <div className="w-full md:w-1/2 h-full flex flex-col justify-start items-start gap-2">
            <Invitations mode="four" />
          </div>
          <div className="w-full md:w-1/2 h-full gap-2">
            <InviteFriends gameType="four" />
          </div>
        </div>
      </Card>
    </div>
  );
}