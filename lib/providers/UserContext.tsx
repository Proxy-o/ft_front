import { createContext, Dispatch, SetStateAction } from "react";
import { User } from "../types";

export const UserContext = createContext<{
  currentUser: User | null;
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
}>({ currentUser: null, setCurrentUser: () => {} });
