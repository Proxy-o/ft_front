"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import TanstackProvider from "@/lib/providers/TanstackProvider";

const inter = Inter({ subsets: ["latin"] });
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import HomeSkel from "@/components/skeletons/homeSkel";
import dynamic from "next/dynamic";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { UserContextProvider } from "@/lib/providers/UserContextProvider";
import { Toaster } from "@/components/ui/sonner";

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
            <UserContextProvider>
              <Suspense fallback={<HomeSkel />}>
                <div className="md:flex relative">
                  {mb ? (
                    <Nav />
                  ) : (
                    <div className="pl-1  w-fit   absolute z-50  h-6">
                      <Sheet>
                        <SheetTrigger>
                          <Menu size={20} />
                        </SheetTrigger>
                        <SheetContent side={"left"} className="w-18 p-0">
                          <Nav />
                        </SheetContent>
                      </Sheet>
                    </div>
                  )}
                  <main className="border-l-[0.04rem] w-full sm:mx-0 h-screen overflow-auto  md:p-0">
                    {children}
                  </main>
                  <Toaster />
                </div>
              </Suspense>
            </UserContextProvider>
          </ThemeProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
