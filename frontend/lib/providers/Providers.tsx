"use client";
import React, { createContext, useContext, useState } from "react";
import TanstackProvider from "./TanstackProvider";
import dynamic from "next/dynamic";

const ThemeProvider = dynamic(() => import("./ThemeProvider"), {
    ssr: false,
});

const appContext = createContext<any>(null);

const Providers: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [data, setData] = useState<any>({loggedIn: false, user: null});

    return (
        <TanstackProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <appContext.Provider value={{data, setData}}>
              {children}
            </appContext.Provider>
          </ThemeProvider>
        </TanstackProvider>
    );
}

export default Providers

export const useAppContext = () => useContext(appContext);