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
  const logged_in = getCookie("logged_in");
  const is_public_route = ["/", "/login", "/register"].includes(usePathname());
  useEffect(() => {
    if (logged_in === "yes" && is_public_route) {
      router.push("/game");
    }
  }, [is_public_route, logged_in, router]);

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
              <div className="relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-primary/10 to-background/20">
                <main className="border-l-[0.04rem] mx-0 sm:mx-2 md:p-0">
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
