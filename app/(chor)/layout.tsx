"use client";
import getCookie from "@/lib/functions/getCookie";
import SearchFriend from "./profile/components/searchFriend";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const is_logged_in = getCookie("logged_in");
  if (!is_logged_in) {
    return router.push("/login");
  }

  return (
    <>
      <SearchFriend />
      {children}
    </>
  );
}
