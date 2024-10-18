import { createContext, useContext, useEffect, useReducer } from "react";
// import useGetUser from "@/app/(chor)/profile/hooks/useGetUser";

type Action =
    | { type: "get", payload: string }
    | { type: "del" };

type ContextData = {
    logged_in: boolean,
    user_id?: string,
}

const appContext = createContext<any>(null);

const UserProviders: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [data, dispatch] = useReducer((state: ContextData, action: Action) => {
        switch (action.type) {
          case "get":
            return { ...state, user: action.payload };
          case "del":
            return { ...state, user: null };
          default:
            return state;
        }
      }, {logged_in: false, user: null});
      
      // const { data: user, isSuccess } = useGetUser("0");
    
      // useEffect(() => {
      //   if (isSuccess && user) {
      //     dispatch({type: "get", payload: user});
      //   }
      //   else if (!isSuccess) {
      //       dispatch({type: "del"});
      //   }
      // }, [isSuccess, user]);


      return (
        <appContext.Provider value={{data, dispatch}}>
            {children}
        </appContext.Provider>
      )
};

export default UserProviders;

export const useUserContext = () => {
    const context = useContext(appContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}