"use client";
import { Button } from "@/components/ui/button";
import getCookie from "@/lib/functions/getCookie";
import React, { useState, useCallback, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import useGetMessages from "../hooks/useGetMessages";
import ChatBubble from "./chatBubble";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { SendHorizonal } from "lucide-react";
import { User } from "@/lib/types";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ChatCard({
  receiver,
  sender,
}: {
  receiver: User;
  sender: User;
}) {
  const user_id = getCookie("user_id");
  const senderId = sender.id;
  const receiverId = receiver.id;
  const token = getCookie("refresh");
  const socketUrl = process.env.NEXT_PUBLIC_CHAT_URL + "2/?refresh=" + token;
  const { sendJsonMessage, lastMessage } = useWebSocket(socketUrl);

  const [hasMore, setHasMore] = useState(true);
  const [message, setMessage] = useState("");
  const [msgLength, setMsgLength] = useState(0);
  const { data, isSuccess, fetchNextPage } = useGetMessages({
    senderId,
    receiverId,
  });

  const hasNoMessages = data?.pages[0].results.length === 0;
  const handelSendMessage = () => {
    const toSend = "/pm " + receiverId + " " + message;
    sendJsonMessage({ message: toSend });
    queryClient.invalidateQueries({
      queryKey: [`messages_${senderId}_${receiverId}`],
    });

    setMessage("");
  };

  const queryClient = useQueryClient();
  useEffect(() => {
    if (lastMessage) {
      queryClient.invalidateQueries({
        queryKey: [`messages_${senderId}_${receiverId}`],
      });
    }
  }, [lastMessage, queryClient, senderId, receiverId]);

  const handleFetchNextPage = useCallback(() => {
    if (data?.pages[data.pages.length - 1].next === null) {
      setHasMore(false);
      return;
    }
    fetchNextPage();
    setMsgLength(
      (prev) => prev + data?.pages[data.pages.length - 1].results.length
    );
  }, [fetchNextPage, data]);

  return (
    <div className=" flex flex-col h-screen border-r w-full  relative ">
      <div className="h-12 flex justify-end md:justify-start ml-2 p-1 shadow-sm border-b-2 ">
        <Avatar className=" mr-2">
          <AvatarImage
            src={receiver.avatar}
            alt="profile image"
            className="rounded-full h-8 w-8"
          />
          <AvatarFallback className="rounded-sm">PF</AvatarFallback>
        </Avatar>
        <p className="text-center flex items-center mr-2 w-fit overflow-clip ">
          {receiver.username}
        </p>
      </div>
      <div
        className="  overflow-auto flex flex-col-reverse   scrollbar scrollbar-thumb-primary/10 scrollbar-track-secondary scrollbar-w-2 p-2 pt-4 mb-[72px]"
        id="scrollableDiv"
      >
        <InfiniteScroll
          className="flex flex-col-reverse "
          dataLength={msgLength}
          next={handleFetchNextPage}
          inverse={true}
          hasMore={hasMore}
          loader={""}
          scrollableTarget="scrollableDiv"
        >
          {isSuccess && !hasNoMessages ? (
            data?.pages.map((page) => {
              return page.results.map((result: any, index: number) => {
                return (
                  <ChatBubble
                    key={index}
                    message={result.content}
                    me={result.user == user_id}
                    sender={sender}
                    receiver={receiver}
                  />
                );
              });
            })
          ) : (
            <div className="flex justify-center items-center  bg-secondary/30 rounded-sm mt-24 h-12">
              <p>No Messages yet</p>
            </div>
          )}
        </InfiniteScroll>
      </div>
      <div className="flex justify-between items-center bg-secondary/90 w-full p-2 absolute bottom-0 ">
        <Input
          placeholder="Type a message"
          value={message}
          className="w-full mr-2 h-14"
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handelSendMessage();
            }
          }}
        />
        <Button
          onClick={handelSendMessage}
          className="absolute right-6 border-none "
          variant={"outline"}
        >
          <SendHorizonal className="text-primary" size={20} />
        </Button>
      </div>
    </div>
  );
}
