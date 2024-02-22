"use client";

import getCookie from "@/lib/functions/getCookie";
import { useRouter } from "next/navigation";
import useGetUser from "../profile/hooks/useGetUser";
import { useEffect } from "react";
import Game from "./components/game";
import Invitations from "./components/invitations";
import InviteFriend from "./components/inviteFriend";
import { Separator } from "@/components/ui/separator";

export default function Page() {
    const user_id = getCookie("user_id");
    const router = useRouter();
    const { data: user, error, isSuccess } = useGetUser(user_id || "0");

    useEffect(() => {
        if (!user && isSuccess) {
            router.push("/login");
        }
    }, [user, isSuccess, router]);
    return (
        <div className="w-fit h-fit flex flex-row justify-start items-start dark:text-white">
            <div className="w-fit h-fit flex flex-col justify-start items-start dark:text-white">
                <Invitations />
                <Separator className="w-full mt-4" />
                <InviteFriend />
            </div>
            <Game />
        </div>
    );
}