import getCookie from "@/lib/functions/getCookie";
import useGetInvitations from "../hooks/useGetInvitations";
import { Swords } from 'lucide-react';
import { CircleOff } from 'lucide-react';
import useInvitationSocket from "@/lib/hooks/InvitationSocket";
import { useEffect } from "react";


const invitations = () => {
    
    const user_id = getCookie("user_id");

    let { data: invitations, acceptMutation, declineMutation, refetch } = useGetInvitations(user_id || "0");

    const {newNotif} = useInvitationSocket();

    useEffect(() => {
        if (newNotif() !== null) {
            refetch();
        }
    }, [newNotif]);

    return (
        <div className="w-full flex flex-col justify-start items-start dark:text-white">
            <h1 className="text-4xl mt-10 ml-10">Challenges</h1>
            {
                (invitations && invitations.length !== 0) ? 
                    invitations.map((invitation: { id: string; sender: { username: string; avatar: string;}; timestamp: string; is_accepted: boolean;}) => {
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
                                    onClick={async () => {
                                        try {
                                            await acceptMutation(invitation.id);
                                        } catch (error) {
                                            console.error(error);
                                        }
                                    }}>
                                        <Swords size={20}/>
                                    </button>
                                    <button 
                                    className="ml-2 bg-secondary hover:bg-black text-white px-2 py-1 rounded-md"
                                    onClick={() => declineMutation(invitation.id)}>
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

export default invitations;