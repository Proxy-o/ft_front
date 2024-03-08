"use client";

import getCookie from "@/lib/functions/getCookie";
import useGetInvitations from "../hooks/useGetInvitations";
import { Swords } from 'lucide-react';
import { CircleOff } from 'lucide-react';
import useInvitationSocket from "@/lib/hooks/InvitationSocket";
import { useEffect } from "react";


const Invitations = (props: {invitations: {
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
        }[],
        acceptInvitation: (invitationId: string) => Promise<string>,
        declineMutation: (invitationId: string) => Promise<void>,
        refetch: () => void}
    ) => {
    const {invitations, acceptInvitation, declineMutation, refetch} = props;
    const user_id = getCookie("user_id");
    const {newNotif} = useInvitationSocket();

    useEffect(() => {
        refetch();
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
