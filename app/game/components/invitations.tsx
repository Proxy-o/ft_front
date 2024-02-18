import React, { use, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { User, UserPlus } from "lucide-react";
import axiosInstance from "@/lib/functions/axiosInstance";

import getCookie from "@/lib/functions/getCookie";
import useGetFriends from "@/app/chat/hooks/useGetFriends";


const invitations = () => {
    const [sentInvitations, setSentInvitations] = useState([]);
    
    const user_id = getCookie("user_id");
    
    const friends = useGetFriends(user_id || "0");
    
    const invite = async (userid: string) => {
        const res = await axiosInstance.post("game/send_invitation", {

            sender: user_id,
            receiver: userid,
        });
        console.log(res);
    }

    useEffect(() => {
        const fetchData = async () => {
            const res = await axiosInstance.get("game/sent_invitations", {
                params: {
                    user_id: user_id,
                }
            });
            console.log(res.data);
            setSentInvitations(res.data);
        };
        
        fetchData();
    }, []);
    return (
        <div className="w-1/5 h-full flex flex-col justify-start items-start dark:text-white">
            <h1 className="text-4xl mt-10 ml-10">Invitations</h1>
            {
                sentInvitations.map((invitation: { sender: { id: string, username: string; avatar: string; }; receiver: { id: string, username: string; avatar: string; }; time: string; is_accepted: boolean; }) => {
                    return (
                        <div key={invitation.sender.username} className="flex flex- justify-start items-center mt-5 ml-10">
                            <img src={invitation.sender.avatar} alt="avatar" className="w-10 h-10 rounded-full"/>
                            <h1 className="ml-2">{invitation.sender.username}</h1>
                            <h1 className="ml-2">invited</h1>
                            <img src={invitation.receiver.avatar} alt="avatar" className="w-10 h-10 rounded-full"/>
                            <h1 className="ml-2">{invitation.receiver.username}</h1>
                            <h1 className="ml-2">at {invitation.time}</h1>
                            <h1 className="ml-2">{invitation.is_accepted ? "Accepted" : "Pending"}</h1>
                        </div>
                    );
                })
            }
            <Separator className="my-4 mr-2"/>
            <h1 className="text-4xl mt-5 ml-10">Invitate a friend</h1>
            <div className="flex flex-row justify-start items-center mt-5 ml-10">
                {
                    
                    friends.data && friends.data.map((friend: { id: string; username: string; avatar: string; }) => {
                        return (
                            <div key={friend.id} className="flex flex-row justify-start items-center">
                                <img src={friend.avatar} alt="avatar" className="w-10 h-10 rounded-full"/>
                                <h1 className="ml-2">{friend.username} {friend.avatar}</h1>
                                <button className="ml-2 bg-primary text-white px-2 py-1 rounded-md" onClick={() => invite(friend.id)}><UserPlus size={20}/></button>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default invitations;