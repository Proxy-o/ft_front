"use client";
import { Button } from "@/components/ui/button";
import React, { useState, useCallback, useEffect, useRef } from "react";
import useGetMessages from "../hooks/useGetMessages";
import ChatBubble from "./chatBubble";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { SendHorizonal, Swords } from "lucide-react";
import { User } from "@/lib/types";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import readMessages from "../hooks/useReadMessages";
import { Message } from "../types";
import Link from "next/link";
import useChatSocket from "../../game/hooks/sockets/useChatSocket";
import { cn } from "@/lib/utils";
import useInvitationSocket from "../../game/hooks/sockets/useInvitationSocket";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useSendInvitation from "../../game/hooks/invitations/useSendInvitation";

export default function ChatCard({
  receiver,
  sender,
}: {
  receiver: User;
  sender: User;
}) {
  const senderId = sender.id;
  const receiverId = receiver.id;

  const { lastJsonMessage, sendJsonMessage, lastMessage } = useChatSocket();
  const { handelSendInvitation } = useInvitationSocket();
  const router = useRouter();
  const [isBlocked, setIsBlocked] = useState(false);
  const { mutate: invite } = useSendInvitation();
  const [hasMore, setHasMore] = useState(true);
  const [message, setMessage] = useState("");
  const [msgLength, setMsgLength] = useState(0);
  const { data, isSuccess, fetchNextPage } = useGetMessages({
    senderId,
    receiverId,
  });

  const hasNoMessages = data?.pages[0].results.length === 0;
  const handelSendMessage = () => {
    if (message.length < 1) {
      return;
    }
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
    if (
      lastJsonMessage &&
      (lastJsonMessage as { type: string }).type === "blocked"
    ) {
      setIsBlocked(true);
    }
    else if (
      lastJsonMessage && (lastJsonMessage as { type: string }).type === "toLong")
    {
      toast.error("Message is too long");
    } 
    else {
      setIsBlocked(false);
    }

  }, [lastMessage, queryClient, senderId, receiverId, lastJsonMessage]);

  useEffect(() => {
    readMessages(receiverId).then(() => {
      queryClient.invalidateQueries({
        queryKey: ["friends", senderId],
      });
    });
  }, [lastMessage, receiverId, queryClient, senderId]);

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
  const chatRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  });

  return (
    <div
      className=" flex flex-col h-[calc(100vh-7.8rem)] border-r w-full  relative  "
      ref={chatRef}
    >
      <Link
        className="  flex justify-between items-center ml-2 p-2 shadow-2xl rounded-md bg-secondary/50 mr-2 mt-1 "
        href={`/profile/${receiver.id}`}
      >
        <div className="flex">
          <Avatar className=" mr-2 relative">
            <div
              className={cn(
                " size-2 rounded-full absolute bottom-1 -right-1 z-50 border border-white",
                receiver.status === "online"
                  ? "bg-green-500"
                  : receiver.status === "playing"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              )}
            />
            <AvatarImage
              src={receiver.avatar}
              alt={receiver.username}
              className="rounded-full h-8 w-8"
            />
            <AvatarFallback className="rounded-full h-8 w-8">
              {receiver.username?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col  mr-2 w-fit overflow-clip ">
            {receiver.username}
            <p className="text-xs text-gray-600">{receiver.status}</p>
          </div>
        </div>
        <div className="mr-10 md:mr-0">
          <Swords
            className="h-30 hover:scale-90 transition-all"
            onClick={(e) => {
              e.preventDefault();
                 invite({
                userid: receiverId,
                gameType: "two",
              });
              router.push("/game/oneVone");
            }}
          />
        </div>
      </Link>
      <div
        className="  overflow-auto flex flex-col-reverse   scrollbar scrollbar-thumb-primary/20 scrollbar-w-2 p-2 pt-4 mb-[72px]"
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
              return page.results.map((result: Message, index: number) => {
                return (
                  <ChatBubble
                    key={index}
                    message={result}
                    me={result.user == senderId}
                    receiver={receiver}
                  />
                );
              });
            })
          ) : (
            <div className="flex justify-center items-center  bg-secondary/30 rounded-full mt-24 h-12">
              <p>No Messages yet</p>
            </div>
          )}
        </InfiniteScroll>
      </div>
      <div className="flex justify-between items-center bg-secondary/90 w-full p-2 absolute bottom-0 ">
        {!isBlocked ? (
          <>
            <Input
              disabled={isBlocked}
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
          </>
        ) : (

          <h1 className="w-full text-center bg-primary/30 rounded-lg h-full">
            {(lastJsonMessage as { message: string })?.message}
          </h1>
        )}
      </div>
    </div>
  );
}
