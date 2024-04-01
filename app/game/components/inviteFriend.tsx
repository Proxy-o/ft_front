import { Sword } from "lucide-react";
import axiosInstance from "@/lib/functions/axiosInstance";
import getCookie from "@/lib/functions/getCookie";
import useGetFriends from "@/app/chat/hooks/useGetFriends";
import useGameSocket from "@/lib/hooks/useGameSocket";

const InviteFriends = () => {
  const { handelSendInvitation } = useGameSocket();

  const user_id = getCookie("user_id");

  const friends = useGetFriends(user_id || "0");

  const invite = async (userid: string) => {
    try {
      const res = await axiosInstance.post("game/send_invitation", {
        sender: user_id,
        receiver: userid,
      });
      if (res.status === 201) {
        handelSendInvitation(userid);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-start items-start">
      <h1 className="text-4xl mt-5">Defy a friend</h1>
      <div className="flex flex-row justify-start items-center mt-5 ml-10">
        {friends.data &&
          friends.data.map(
            (friend: { id: string; username: string; avatar: string }) => {
              return (
                <div
                  key={friend.id}
                  className="flex flex-row justify-start items-center"
                >
                  <img
                    src={friend.avatar}
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <h1 className="ml-2">{friend.username}</h1>
                  <button
                    className="ml-2 bg-primary text-white px-2 py-1 rounded-md"
                    onClick={() => invite(friend.id)}
                  >
                    <Sword size={20} />
                  </button>
                </div>
              );
            }
          )}
      </div>
    </div>
  );
};

export default InviteFriends;
