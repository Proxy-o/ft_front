import React, { useState } from "react";
import { UserContext } from "./UserContext";

interface UserContextProviderProps {
  children: React.ReactNode;
}

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const [currentUser, setCurrentUser] = useState({});

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};
