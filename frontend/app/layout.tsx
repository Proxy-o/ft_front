"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import TanstackProvider from "@/lib/providers/TanstackProvider";

const inter = Inter({
  subsets: ["latin"],

  weight: "800",
});
import { Suspense, useEffect } from "react";
import HomeSkel from "@/components/skeletons/homeSkel";
import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/sonner";
import { usePathname } from "next/navigation";
import getCookie from "@/lib/functions/getCookie";
import { useRouter } from "next/navigation";

const ThemeProvider = dynamic(() => import("@/lib/providers/ThemeProvider"), {
  ssr: false,
});

export default function RootLayout({children}: {children: React.ReactNode}) {
  const router = useRouter();
  const path = usePathname();
  const logged_in = getCookie("logged_in");

  useEffect(() => {
    if (logged_in == "yes" && ["/", "/login", "/register"].includes(path)) {
      router.push("/game")
    }
  }, [path, logged_in, router]);

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
            <Suspense fallback={<HomeSkel />}>
              <div className="md:flex relative">
                <main className="">
                  {children}
                </main>
                <Toaster duration={3000} />
              </div>
            </Suspense>
          </ThemeProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
