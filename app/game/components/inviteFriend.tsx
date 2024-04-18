import { Sword } from "lucide-react";
import getCookie from "@/lib/functions/getCookie";
import useGetFriends from "@/app/chat/hooks/useGetFriends";
import useGameSocket from "@/lib/hooks/useGameSocket";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useSendInvitation from "../hooks/useSendInvitation";

const InviteFriends = ({ gameType }: { gameType: string }) => {
  const { handelSendInvitation } = useGameSocket();

  const user_id = getCookie("user_id");

  const friends = useGetFriends(user_id || "0");

  const { mutate: invite } = useSendInvitation();

  return (
    <div className="w-fit h-fit flex flex-col justify-start items-start mx-auto">
      <h1 className="text-4xl mt-5">Defy a friend</h1>
      <div className="flex flex-col justify-start items-center mt-5 ml-10">
        {friends.data &&
          friends.data.map(
            (friend: { id: string; username: string; avatar: string }) => {
              return (
                <div
                  key={friend.id}
                  className="flex flex-row justify-start items-center"
                >
                  <Avatar className=" mr-2">
                    <AvatarImage
                      src={friend.avatar}
                      alt="profile image"
                      className="rounded-full h-8 w-8"
                    />
                    <AvatarFallback className="rounded-sm">PF</AvatarFallback>
                  </Avatar>
                  <h1 className="ml-2">{friend.username}</h1>
                  <button
                    className="ml-2 bg-primary text-white px-2 py-1 rounded-md"
                    onClick={() => {
                      invite({
                        userid: friend.id,
                        gameType: gameType,
                      });
                      handelSendInvitation(friend.id);
                    }}
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
