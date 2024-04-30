"use client";

import Two from "./two";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useGetUser from "@/app/profile/hooks/useGetUser";
import getCookie from "@/lib/functions/getCookie";
import useGameSocket from "@/lib/hooks/useGameSocket";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
      <Two type="two" />
    </div>
  );
}
