"use client";
import getCookie from "@/lib/functions/getCookie";
import SearchFriend from "./profile/components/searchFriend";
import { usePathname, useRouter } from "next/navigation";
import MobilNav from "@/components/navBar/mobilNav";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const is_logged_in = getCookie("logged_in");
  const mb = useMediaQuery("(min-width: 768px)");
  const is_local = usePathname() === "/game/local";

  if (!is_logged_in && !is_local) {
    return router.push("/login");
  }

  return (
    <div className="h-full relative">
      <div
        className={cn(
          "flex w-full  overflow-auto",
          !mb && "h-[calc(100vh-3.7rem)]"
        )}
      >
        <div className="w-full h-full ">
          <SearchFriend />
          {children}
        </div>
      </div>
      {!mb && <MobilNav />}
    </div>
  );
}
