"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import TanstackProvider from "@/lib/providers/TanstackProvider";

const inter = Inter({ subsets: ["latin"] });
import { Suspense, lazy, useEffect, useState } from "react";
import HomeSkel from "@/components/skeletons/homeSkel";
import dynamic from "next/dynamic";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import { UserContextProvider } from "@/lib/providers/UserContextProvider";
import { Toaster } from "@/components/ui/sonner";
import { usePathname } from "next/navigation";

const ThemeProvider = dynamic(() => import("@/lib/providers/ThemeProvider"), {
  ssr: false,
});
const Nav = lazy(() => import("@/components/navBar/nav"));

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const mb = useMediaQuery("(min-width: 768px)");
  const [showNav, setShowNav] = useState<boolean>(false);
  const path = usePathname();

  useEffect(() => {
    if (mb && path != "/login" && path != "/register") {
      setShowNav(true);
    } else {
      setShowNav(false);
    }
  }, [path, mb]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <TanstackProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <h1></h1>
            <UserContextProvider>
              <Suspense fallback={<HomeSkel />}>
                <div className="md:flex relative">
                  {showNav && <Nav />}
                  <main className="border-l-[0.04rem] w-full sm:mx-0 h-screen overflow-auto  md:p-0">
                    {children}
                  </main>
                  <Toaster duration={1000} />
                </div>
              </Suspense>
            </UserContextProvider>
          </ThemeProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
