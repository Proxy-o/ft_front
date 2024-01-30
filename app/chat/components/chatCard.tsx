"use client";
import { Button } from "@/components/ui/button";
import getCookie from "@/lib/functions/getCookie";
import React, { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Card } from "@/components/ui/card";
import useGetMessages from "../hooks/useGetMessages";
import ChatBubble from "./chatBubble";
import { Conversation } from "../types";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";

export default function ChatCard({ senderId, receiverId }: Conversation) {
  const token = getCookie("refresh");
  const user_id = getCookie("user_id");
  const [socketUrl, setSocketUrl] = useState(
    process.env.NEXT_PUBLIC_CHAT_URL + "2/?refresh=" + token
  );
  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const [hasMore, setHasMore] = useState(true);
  const [message, setMessage] = useState("");
  const [msgLength, setMsgLength] = useState(0);

  const handelSendMessage = () => {
    const toSend = "/pm " + receiverId + " " + message;
    sendJsonMessage({ message: toSend });
  };
  const { data, isSuccess, fetchNextPage } = useGetMessages({
    senderId,
    receiverId,
  });

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
    <Card className="p-2 relative ">
      <div
        id="scrollableDiv"
        style={{
          height: 300,
          overflow: "auto",
          display: "flex",
          flexDirection: "column-reverse",
        }}
      >
        <InfiniteScroll
          dataLength={msgLength}
          next={handleFetchNextPage}
          style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
          inverse={true} //
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          scrollableTarget="scrollableDiv"
        >
          {isSuccess &&
            data?.pages
              // .slice()
              // .reverse()
              .map((page) => {
                return (
                  page.results
                    // .slice()
                    // .reverse()
                    .map((result: any, index: number) => {
                      return (
                        <ChatBubble
                          key={index}
                          message={result.content}
                          me={result.user == user_id}
                        />
                      );
                    })
                );
              })}
        </InfiniteScroll>
      </div>
      <div className="flex justify-between items-center">
        <Input
          className="w-full"
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button onClick={handelSendMessage}>Send</Button>
      </div>
    </Card>
  );
}
