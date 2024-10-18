'use client';
import ChatCard from "../components/chatCard";
import useGetUser from "../../profile/hooks/useGetUser";

export default function Page({ params }: { params: { slug: string } }) {
    const { data: sender, isSuccess: isSender,  } = useGetUser( "0");
    const { data: receiver, isSuccess: isReceiver, } = useGetUser(params.slug);

    if (sender && params.slug === sender.id) {
        return <div>You cant chat with yourself</div>;
    }
    // if (isLoading || resIsLoading) {
    //     return <div>Loading...</div>;
    // }
    else if (isSender || isReceiver) {
        return (
            <ChatCard receiver={receiver} sender={sender} />
        );
    }
    else {
        return <div>Failed to load user</div>;
    }
  


}
