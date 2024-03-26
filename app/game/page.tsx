"use client";
import getCookie from "@/lib/functions/getCookie";

import useGetUser from "../profile/hooks/useGetUser";
import { useEffect, useState } from "react";
import Invitations from "./components/invitations";
import InviteFriend from "./components/inviteFriend";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import GameNav from "./components/gameNav";
import OneOnline from "./components/oneOnline";
import OneOffline from "./components/oneOffline";
export default function Page() {
    const user_id = getCookie("user_id") || "";
    const { data: user, isSuccess } = useGetUser(user_id || "0");
    const router = useRouter();
    const [tab, setTab] = useState("local");
    
    useEffect(() => {
        if (!user && isSuccess) {
            router.push("/login");
        }
    }, [user, isSuccess, router]);

    // window.addEventListener('offline', () => {
    //     console.log("offline");
    // }
    // );

    return (
        <>
            <GameNav setTab={setTab} tab={tab} />
            <div className="w-[500px] h-fit flex flex-row justify-start items-start dark:text-white mx-auto mt-10">
                {(tab === "online") && (
                <>
                    <div className="w-fit h-fit flex flex-col justify-start items-start dark:text-white">
                        <Invitations />
                        <Separator className="w-full mt-4" />
                        <InviteFriend />
                    </div>
                    <OneOnline />
                </>
                )}
                {(tab === "local") && (
                    <>
                        <OneOffline />
                    </>
                )}
            </div>
        </>
    );
}
