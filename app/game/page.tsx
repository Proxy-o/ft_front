"use client";
import getCookie from "@/lib/functions/getCookie";

import useGetUser from "../profile/hooks/useGetUser";
import { useEffect, useState } from "react";
import Game from "./components/game";
import Invitations from "./components/invitations";
import InviteFriend from "./components/inviteFriend";
import { Separator } from "@/components/ui/separator";
import useGameSocket from "@/lib/hooks/useGameSocket";
import { useRouter } from "next/navigation";
import useGetGame from "./hooks/useGetGames";
import GameNav from "./components/gameNav";
export default function Page() {
    const user_id = getCookie("user_id") || "";
    const { data: user, isSuccess } = useGetUser(user_id || "0");
    const router = useRouter();
    const [tab, setTab] = useState("online");
    
    //socket
    const { newNotif } = useGameSocket();
    
    //game logic
    const [startGame, setStartGame] = useState(false);
    const { onGoingGame } = useGetGame(user_id || "0");

    useEffect(() => {
        if (!user && isSuccess) {
            router.push("/login");
        }
    }, [user, isSuccess, router]);

    
    useEffect(() => {
        const notif = newNotif();
        const message = notif && JSON.parse(notif?.data) || "";
        if (message && message.message?.split(" ")[0] === "/start") {
            // invitaionsData.refetch();
            onGoingGame.refetch();
        }
    }, [newNotif()?.data]);

    useEffect(() => {
        if (onGoingGame.isSuccess && onGoingGame.data.game?.user1)
        {
            setStartGame(true);
        }
        else if (onGoingGame.isSuccess && onGoingGame.data.game?.user1 === undefined)
        {
            setStartGame(false);
        }
    }
    , [onGoingGame]);

    return (
        <>
            <GameNav setTab={setTab} tab={tab} />
            <div className="w-fit h-fit flex flex-row justify-start items-start dark:text-white">
                {(tab === "online") && (
                    <div className="w-fit h-fit flex flex-col justify-start items-start dark:text-white">
                        <Invitations />
                        <Separator className="w-full mt-4" />
                        <InviteFriend />
                    </div>
                )}
                {startGame && onGoingGame.isSuccess && onGoingGame.data !== null && (
                    <Game />
                    )}
            </div>
        </>
    );


}
