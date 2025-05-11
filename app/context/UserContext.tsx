"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { getUserServer } from "../Actions/User";

type UserContextType = {
   user: User | null;
   setUser: (user: User) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProviderWrapper = ({ children }: { children: ReactNode }) => {
   const { data: session, status } = useSession();
   const [user, setUser] = useState<User | null>(null);

   const getUser = async () => {
      const res = await getUserServer();
      if (!res) {
         redirect('/login');
      } else {
         setUser(res);
      }
   }

   useEffect(() => {
      if (status == "authenticated" && session.user?.email) {
         getUser();
      }
   }, [status, session])

   return (
      <UserContext.Provider value={{ user, setUser }}>
         {children}
      </UserContext.Provider>
   );
};

export const useUser = () => {
   const context = useContext(UserContext);
   if (!context) throw new Error("useUser must be used within UserProvider");
   return context;
};
