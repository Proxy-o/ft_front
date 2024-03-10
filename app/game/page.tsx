"use client";
import getCookie from "@/lib/functions/getCookie";

import useGetUser from "../profile/hooks/useGetUser";
import { useEffect, useState } from "react";
import Game from "./components/game";
import Invitations from "./components/invitations";
import InviteFriend from "./components/inviteFriend";
import { Separator } from "@/components/ui/separator";
import useGameSocket from "@/lib/hooks/useGameSocket";
import useGetInvitations from "./hooks/useGetInvitations";
import { useRouter } from "next/navigation";
import useGetGame from "./hooks/useGetGames";
import { Invitation } from "@/lib/types";

export default function Page() {
    const user_id = getCookie("user_id") || "";
    const [game, setGame] = useState(false);
    const router = useRouter();
    const { data: user, isSuccess } = useGetUser(user_id || "0");
    const { handleAcceptInvitation, newNotif } = useGameSocket();
    const { onGoingGame, refetchOnGoingGame, surrenderGame } = useGetGame(user_id || "0");
    let { data: invitations, acceptMutation, declineMutation, refetch } = useGetInvitations(user_id || "0");
    const [gameId, setGameId] = useState("");

    let myinvitations: Invitation[] = invitations || [];

    
    useEffect(() => {
        if (onGoingGame && onGoingGame.game === null)
            setGame(false);
        else
        {
            setGame(true);
        }
    }
    , [gameId, onGoingGame]);

    useEffect(() => {
        const notif = newNotif();
        const message = notif && JSON.parse(notif?.data) || "";
        if (message && message.message?.split(" ")[0] === "/start") {
            refetchOnGoingGame();
        }

    }
    , [newNotif()]);


    const acceptInvitation = async (invitationId: string) => {
        try {
            const newGameId = await acceptMutation(invitationId);
            setGameId(newGameId);
            handleAcceptInvitation(invitationId);
            refetchOnGoingGame();
        } catch (error) {
            console.log(error);
        }
    }

    const declineInvitation = async (invitationId: string) => {
        try {
            await declineMutation(invitationId);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (!user && isSuccess) {
            router.push("/login");
        }
    }, [user, isSuccess, router]);

    return (
        <div className="w-fit h-fit flex flex-row justify-start items-start dark:text-white">
            <div className="w-fit h-fit flex flex-col justify-start items-start dark:text-white">
                <Invitations
                    invitations={myinvitations}
                    acceptInvitation={acceptInvitation}
                    declineMutation={declineInvitation}
                    refetch={refetch}
                />
                <Separator className="w-full mt-4" />
                <InviteFriend />
            </div>
            {game && <Game gameId={gameId} surrenderGame={surrenderGame} /> }
        </div>
    );


}
