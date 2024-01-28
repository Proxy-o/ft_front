import React from "react";

export default function ChatBubble({ message }: { message: string }) {
  return (
    <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4  rounded-e-xl rounded-es-xl bg-primary/30">
      <p>{message}</p>
    </div>
  );
}
