"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import TanstackProvider from "@/lib/providers/TanstackProvider";

const inter = Inter({ subsets: ["latin"] });
import { Suspense, lazy } from "react";
import HomeSkel from "@/components/skeletons/homeSkel";
import dynamic from "next/dynamic";
const ThemeProvider = dynamic(() => import("@/lib/providers/ThemeProvider"), {
  ssr: false,
});

const Nav = lazy(() => import("@/components/nav"));

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            <Suspense fallback={<HomeSkel />}>
              <div className="flex">
                <Nav />
                <main className="border-l-[0.04rem] w-full sm:mx-0">
                  {children}
                </main>
              </div>
            </Suspense>
          </ThemeProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
