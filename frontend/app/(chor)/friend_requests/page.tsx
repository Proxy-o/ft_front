import React from "react";
import FriendRequests from "../friends/components/friendRequests";
import ResCard from "@/components/ui/resCard";

export default function page() {
  return (
    <ResCard>
      <FriendRequests />
    </ResCard>
  );
}
