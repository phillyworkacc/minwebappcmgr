'use client'
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import AppWrapper from "@/components/AppWrapper/AppWrapper";

type UserDetails = {
   userid: string;
   name: string;
   email: string;
}

export default function AccountPage ({ user }: { user: UserDetails }) {
   return (
      <AppWrapper>
         <div className="text-l bold-700 mb-1">Your account</div>
         <div className="text-sm bold-500">{user.name}</div>
         <div className="text-xs bold-500">{user.email}</div>
         <div className="text-xs pd-2">You are signed in with <b>{user.email}</b></div>
         <button className="xxs pd-11 full" onClick={() => signOut()}>
            <LogOut /> Sign Out
         </button>
      </AppWrapper>
   )
}
