import React, { useEffect, useRef, useState } from "react";
import { User } from "@/lib/types";
import ChatFriendCard from "./chatFriendCard";
import ChatCard from "./chatCard";
import getCookie from "@/lib/functions/getCookie";
import useGetFriends from "../hooks/useGetFriends";

import useMediaQuery from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Users } from "lucide-react";
import useGetUser from "@/app/(chor)/profile/hooks/useGetUser";

export default function ChatList() {
  const user_id = getCookie("user_id");
  const { data: friends, isSuccess } = useGetFriends(user_id || "0");
  const { data: sender, isSuccess: isSender } = useGetUser(user_id || "0");

  const [receiver, setReceiver] = React.useState<User>();
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const handleChatOpen = (friend: User) => {
    if (!isChatOpen) {
      setIsChatOpen(true);
    }
    setReceiverId(parseInt(friend.id));
    setReceiver(friend);
  };
  const mb = useMediaQuery("(min-width: 768px)");
  const [receiverId, setReceiverId] = useState<number>(0);
  const chatRef = useRef<HTMLDivElement>(null); // Specify the type as React.RefObject<HTMLDivElement>
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, []);
  return (
    <>
      <div
        className="relative flex max-w-[60rem] mx-auto border rounded-sm"
        ref={chatRef}
      >
        {receiverId && isSender ? (
          <ChatCard receiver={receiver!} sender={sender} />
        ) : null}
        {mb || !receiverId ? (
          <div
            className={cn(
              "flex flex-col    overflow-y-auto  p-2",
              !isChatOpen ? "w-full" : "w-1/3"
            )}
          >
            {isSuccess && friends.length > 0 ? (
              friends.map((friend: User) => {
                return (
                  <div
                    key={friend.id}
                    onClick={() => handleChatOpen(friend)}
                    className="cursor-pointer "
                  >
                    <ChatFriendCard
                      friend={friend}
                      setReceiverId={setReceiverId}
                      showChat={true}
                    />
                  </div>
                );
              })
            ) : (
              <div className="w-full text-center h-16 flex justify-center items-center bg-primary/5">
                You don&apos;t have any friend to chat with
              </div>
            )}
          </div>
        ) : (
          <>
            <Drawer>
              <DrawerContent className="overflow-auto ">
                {isSuccess &&
                  friends.map((friend: User) => {
                    return (
                      <div
                        key={friend.id}
                        onClick={() => handleChatOpen(friend)}
                        className="cursor-pointer"
                      >
                        <DrawerClose className=" w-full">
                          <ChatFriendCard
                            friend={friend}
                            setReceiverId={setReceiverId}
                          />
                        </DrawerClose>
                      </div>
                    );
                  })}
              </DrawerContent>
              <div className="flex   justify-center   absolute  left-10 z-50">
                <DrawerTrigger className="    w-14 h-9 items-center rounded-full  transition-transform flex justify-center  ">
                  <Users className="w-full h-30  " />
                </DrawerTrigger>
              </div>
            </Drawer>
          </>
        )}
      </div>
    </>
  );
}
