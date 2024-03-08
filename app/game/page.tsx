"use client";
import getCookie from "@/lib/functions/getCookie";

import useGetUser from "../profile/hooks/useGetUser";
import { useEffect } from "react";
import Game from "./components/game";
import Invitations from "./components/invitations";
import InviteFriend from "./components/inviteFriend";
import { Separator } from "@/components/ui/separator";
import useInvitationSocket from "@/lib/hooks/InvitationSocket";
import useGetInvitations from "./hooks/useGetInvitations";
import { useRouter } from "next/navigation";
import useGetGame from "./hooks/useGetGames";

export default function Page() {
    const user_id = getCookie("user_id") || "";
    const router = useRouter();
    const { data: user, isSuccess } = useGetUser(user_id || "0");

    const game = useGetGame(user_id);

    const { handleAcceptInvitation } = useInvitationSocket();

    let { data: invitations, acceptMutation, declineMutation, refetch } = useGetInvitations(user_id || "0");

    let myinvitations: {
        id: string,
        sender: {
            id: string,
            username: string,
            avatar: string,
        },
        reciever: {
            id: string,
            username: string,
            avatar: string,
        },
        timestamp: string,
        is_accepted: boolean,
    }[] = invitations || [];
    const acceptInvitation = async (invitationId: string) => {
        let gameId = "";
        try {
            gameId = await acceptMutation(invitationId);
            handleAcceptInvitation(invitationId);
        } catch (error) {
            console.log(error);
        }
        return gameId;
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
            <Game />
        </div>
    );
}
