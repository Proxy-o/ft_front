import React, { useEffect, useRef, useState } from "react";
import { User } from "@/lib/types";
import ChatFriendCard from "./chatFriendCard";
import ChatCard from "./chatCard";
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
import { Card } from "@/components/ui/card";

export default function ChatList() {
  const { data: sender, isSuccess: isSender } = useGetUser("0");
  const { data: friends, isSuccess } = useGetFriends(sender?.id);
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
    <Card
      className="relative flex mx-2 h-[calc(100vh-7.8rem)] feedRight"
      ref={chatRef}
    >
      {receiverId && isSender ? (
        <ChatCard receiver={receiver!} sender={sender} />
      ) : null}
      {mb || !receiverId ? (
        <div
          className={cn(
            "flex flex-col    overflow-y-auto md:scrollbar scrollbar-thumb-primary/20 scrollbar-w-2 no-scrollbar p-2",
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
            <DrawerContent className=" max-h-96 h-full ">
              <div className="h-full overflow-auto scrollbar scrollbar-thumb-primary/20 scrollbar-w-1 ml-1 mt-1">
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
              </div>
            </DrawerContent>
            <div className="flex   justify-center   absolute  right-2 top-3.5 z-50">
              <DrawerTrigger className="    w-14 h-9 items-center rounded-full  transition-transform flex justify-center  ">
                <Users className="w-full h-30 hover:scale-90 transition-all" />
              </DrawerTrigger>
            </div>
          </Drawer>
        </>
      )}
    </Card>
  );
}
