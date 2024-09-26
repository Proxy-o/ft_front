"use client";
import React from "react";
import TanstackProvider from "./TanstackProvider";
import dynamic from "next/dynamic";

const ThemeProvider = dynamic(() => import("./ThemeProvider"), {
    ssr: false,
});

const Providers: React.FC<{children: React.ReactNode}> = ({ children }) => {
    
    return (
        <TanstackProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </TanstackProvider>
    );
}

export default Providers