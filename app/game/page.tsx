"use client";

import getCookie from "@/lib/functions/getCookie";
import { useRouter } from "next/navigation";
import useGetUser from "../profile/hooks/useGetUser";
import { useEffect } from "react";
import Game from "./components/game";
import Invitations from "./components/invitations";

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
        <div className="w-full h-full flex flex-row justify-center items-center">
            <Invitations />
            <Game />
        </div>
    );
}