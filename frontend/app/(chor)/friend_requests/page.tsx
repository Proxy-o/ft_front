import React from "react";
import FriendRequests from "../friends/components/friendRequests";


export default function page() {
  return (
    <div className="h-[calc(100vh-7.8rem)]  w-full flex flex-col">
      <FriendRequests />
    </div>
  );
}
