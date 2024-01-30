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
    <Card className="relative ">
      <div
        className="no-scrollbar h-[30rem] overflow-auto flex flex-col-reverse mx-2"
        id="scrollableDiv"
      >
        <InfiniteScroll
          className="flex flex-col-reverse"
          dataLength={msgLength}
          next={handleFetchNextPage}
          inverse={true}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          scrollableTarget="scrollableDiv"
        >
          {isSuccess &&
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
            })}
        </InfiniteScroll>
      </div>
      <div className="flex justify-between items-center bg-secondary/30 w-full p-2 relative">
        <Input
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
          className="absolute right-6 h-15 w-13"
          variant={"outline"}
        >
          <SendHorizonal className="text-primary" size={15} />
        </Button>
      </div>
    </Card>
  );
}
