import React from "react";

export default function ChatBubble({
  message,
  me,
}: {
  message: string;
  me: boolean;
}) {
  return me ? (
    <div className="flex w-full justify-end h-fit">
      <p className="flex flex-col  max-w-[320px] p-4 rounded-s-xl rounded-ee-xl bg-green-600/40 mb-2  h-fit break-words whitespace-normal">
        {message}
      </p>
    </div>
  ) : (
    //  message div to the right side
    <div className="flex w-full h-fit">
      <p className="flex flex-col  max-w-[320px] leading-1.5 p-4  rounded-e-xl rounded-es-xl bg-primary/30 mb-2  h-fit  break-words whitespace-normal">
        d{message}
      </p>
    </div>
  );
}
