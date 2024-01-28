"use client";
import { Button } from "@/components/ui/button";
import getCookie from "@/lib/functions/getCookie";
import React, { useState, useCallback, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

export default function Page() {
  const token = getCookie("refresh");
  const [socketUrl, setSocketUrl] = useState(
    process.env.NEXT_PUBLIC_CHAT_URL + "ka/?refresh=" + token
  );

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const handelSendMesage = () => {
    sendJsonMessage({ message: "Hello" });
  };
  return (
    <div>
      {lastMessage && <p>Last message: {lastMessage.data}</p>}
      <Button
        onClick={() => sendJsonMessage({ message: "Hello" })}
        disabled={readyState !== ReadyState.OPEN}
      >
        Click Me to send
      </Button>
      <p>The WebSocket is currently {connectionStatus}</p>
    </div>
  );
}
