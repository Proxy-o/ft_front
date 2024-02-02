"use client";
import { Button } from "@/components/ui/button";
import getCookie from "@/lib/functions/getCookie";
import React, { useState, useCallback, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { Card } from "@/components/ui/card";
import useGetMessages from "../hooks/useGetMessages";
import ChatBubble from "./chatBubble";
import { Conversation } from "../types";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { SendHorizonal } from "lucide-react";

export default function ChatCard({ senderId, receiverId }: Conversation) {
  const token = getCookie("refresh");
  const user_id = getCookie("user_id");
  const [socketUrl, setSocketUrl] = useState(
    process.env.NEXT_PUBLIC_CHAT_URL + "2/?refresh=" + token
  );
  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(socketUrl);

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
    <div className="relative flex flex-col h-full border-r">
      <div
        className="  overflow-auto flex flex-col-reverse mx-2 p-4 scrollbar scrollbar-thumb-primary/10 scrollbar-track-secondary scrollbar-w-2  scrollbar-rounded-sm"
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
      <div className="flex  justify-between items-center bg-secondary/30 w-full p-2 relative">
        <Input
          placeholder="Type a message"
          value={message}
          className="w-full mr-2 h-12"
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
