'use client';
import getCookie from "@/lib/functions/getCookie";
import ChatCard from "../components/chatCard";
import useGetUser from "../../profile/hooks/useGetUser";

export default function Page({ params }: { params: { slug: string } }) {
    const user_id = getCookie("user_id");
  const { data: sender, isSuccess: isSender, isLoading } = useGetUser(user_id || "0");
  const { data: receiver, isSuccess: isReceiver, isLoading: resIsLoading } = useGetUser(params.slug);

  if (params.slug === user_id) {
    return <div>You cant chat with yourself</div>;
    }
    if (isLoading || resIsLoading) {
        return <div>Loading...</div>;
    }
    else if (isSender || isReceiver) {
    return (
        <ChatCard receiver={receiver} sender={sender} />
    );
    }
    else {
        return <div>Failed to load user</div>;
    }
  


}
