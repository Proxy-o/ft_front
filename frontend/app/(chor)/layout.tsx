"use client";
import getCookie from "@/lib/functions/getCookie";
import SearchFriend from "./profile/components/searchFriend";
import { usePathname, useRouter } from "next/navigation";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { useState, useEffect, lazy } from "react";

const Nav = lazy(() => import("@/components/navBar/nav"));
const MobilNav = lazy(() => import("@/components/navBar/mobilNav"));

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const mb = useMediaQuery("(min-width: 768px)");
  const [showNav, setShowNav] = useState<number>(0);
  const path = usePathname();
  const is_local = path === "/game/local";
  const logged_in = getCookie("logged_in");
  
  useEffect(() => {
    if (!is_local && !logged_in) {
      router.push("/login");
    }
  }, [router, is_local, logged_in]);

  useEffect(() => {
    if (is_local) {
      setShowNav(0);
    } else if (mb) {
      setShowNav(1);
    } else {
      setShowNav(2);
    }
  }, [is_local, mb, logged_in]);

  return (
    (logged_in || is_local) && (
      <div className="md:flex h-full relative">
        {(showNav === 1) && <Nav />}
        <div
          className={cn(
            "flex w-full border-l-[0.04rem]",
            !mb && "h-[calc(100vh-3.7rem)]"
          )}
          >
          <div className="relative max-w-[60rem] mx-auto w-full h-full py-0.5">
            {!is_local && <SearchFriend />}
            {children}
          </div>
        </div>
        {(showNav === 2) && <MobilNav />}
      </div>
    )
  );
}
