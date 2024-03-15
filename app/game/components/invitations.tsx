"use client";

import { Swords } from 'lucide-react';
import { CircleOff } from 'lucide-react';
import useGameSocket from "@/lib/hooks/useGameSocket";
import { useEffect } from "react";
import useGetInvitations from '../hooks/useGetInvitations';
import useDeclineInvitation from '../hooks/useDeclineMutation';
import useAcceptInvitation from '../hooks/useAccepteInvitation';
import getCookie from '@/lib/functions/getCookie';
import { Invitation } from '@/lib/types';


const Invitations = () => {
    const { newNotif, handleAcceptInvitation } = useGameSocket();
    const user_id = getCookie("user_id") || "";

    let invitaionsData = useGetInvitations(user_id || "0");
    const { mutate: declineMutation } = useDeclineInvitation();
    const { mutate: acceptInvitationMutation } = useAcceptInvitation();
    const invitations: Invitation[] = (invitaionsData.data) ? invitaionsData.data : [];

    const acceptInvitation = async (invitationId: string) => {
        try {
            acceptInvitationMutation(invitationId);
            handleAcceptInvitation(invitationId);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        invitaionsData.refetch();
    }, [newNotif]);

    return (
        <div className="w-full flex flex-col justify-start items-start dark:text-white">
            <h1 className="text-4xl mt-10 ml-10">Challenges</h1>
            {
                (invitations && invitations.length !== 0) ? 
                    invitations.map((invitation) => {
                        const date = new Date(invitation.timestamp);
                        return (
                            <div key={invitation.id} className={invitation.is_accepted === false ? "hidden" : "" }>
                                <div className="flex flex-row justify-start items-center mt-5 ml-10">
                                    <img src={invitation.sender.avatar} alt="avatar" className="w-10 h-10 rounded-full"/>
                                    <div className="flex flex-col justify-start items-start ml-2">
                                        <h1>{invitation.sender.username}</h1>
                                        <p className="text-xs">{date.toLocaleString()}</p>
                                    </div>
                                    <button 
                                    className="ml-2 bg-primary hover:bg-pink-500 text-white px-2 py-1 rounded-md"
                                    onClick={async () => await acceptInvitation(invitation.id)}>
                                        <Swords size={20}/>
                                    </button>
                                    <button 
                                    className="ml-2 bg-secondary hover:bg-black text-white px-2 py-1 rounded-md"
                                    onClick={async () => await declineMutation(invitation.id)}>
                                        <CircleOff size={20}/>
                                    </button>
                                </div>
                            </div>
                        );
                    })
                : (<h1 className="text-2xl mt-5 ml-10">No invitations</h1>)
            }
        </div>
    ); 
}

export default Invitations;
