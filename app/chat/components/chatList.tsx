import React, { useState } from "react";
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

export default function ChatList() {
  const user_id = getCookie("user_id");
  const { data, isSuccess } = useGetFriends(user_id || "0");
  const [receiverId, setReceiverId] = React.useState<number>(0);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const handleChatOpen = (friend: User) => {
    if (!isChatOpen) {
      setIsChatOpen(true);
    }
    setReceiverId(parseInt(friend.id));
  };
  const mb = useMediaQuery("(min-width: 768px)");

  return (
    <>
      <div className="relative flex">
        {receiverId ? (
          <ChatCard senderId={parseInt(user_id!)} receiverId={receiverId} />
        ) : (
          <></>
        )}
        {mb || !receiverId ? (
          <div
            className={cn(
              "flex flex-col    h-screen  overflow-y-auto  ",
              !isChatOpen ? "w-full" : "w-[40rem]"
            )}
          >
            {isSuccess &&
              data.map((friend: User) => {
                return (
                  <div
                    key={friend.id}
                    onClick={() => handleChatOpen(friend)}
                    className="cursor-pointer "
                  >
                    <ChatFriendCard
                      friend={friend}
                      setReceiverId={setReceiverId}
                    />
                  </div>
                );
              })}
          </div>
        ) : (
          <>
            <Drawer>
              <DrawerContent className="overflow-auto ">
                {isSuccess &&
                  data.map((friend: User) => {
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
              <div className="flex w-full justify-center   absolute top-6">
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
