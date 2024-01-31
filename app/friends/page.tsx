import React from "react";
import FriendRequests from "./components/friendRequests";
import FriendList from "./components/friendList";

export default function Page() {
  return (
    <>
      <FriendList />
      <FriendRequests />
    </>
  );
}
