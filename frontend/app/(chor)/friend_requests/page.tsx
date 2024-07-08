import React from "react";
import FriendRequests from "../friends/components/friendRequests";


export default function page() {
  return (
    <div className="h-[calc(100vh-7.3rem)]  w-full flex flex-col max-w-[60rem] mx-auto">
      <FriendRequests />
    </div>
  );
}
