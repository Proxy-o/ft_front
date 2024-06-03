import React from "react";
import FriendRequests from "../friends/components/friendRequests";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function page() {
  return (
    <div className="h-full p-6 w-full flex flex-col max-w-[60rem] mx-auto">
      <Link
        href="/friends"
        className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          " ml-auto"
        )}
      >
        Friends
      </Link>
      <FriendRequests />
    </div>
  );
}
