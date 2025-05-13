'use client'

import "@/styles/home.css"
import { signOut, useSession } from "next-auth/react";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import AppLogoUserWelcome from "@/components/AppLogoUserWelcome/AppLogoUserWelcome";
import LoadingAccountPage from "./LoadingAccount";
import { LogOut } from "lucide-react";

export default function AccountPage() {
   const { data: session, status } = useSession();
   const { user } = useUser();
   const router = useRouter();

   if (status == "loading") return <LoadingAccountPage />;
   if (!session?.user) return <LoadingAccountPage />;
   if (!user) return <LoadingAccountPage />;

   return (<div className={`home-page ${user.color_theme}`}>
      <Navbar page="account" />
      <div className="app-content">
         <div className="text-c-xxl bold-700 pd-2">Your account</div>
         <AppLogoUserWelcome name={user.name} />
         <div className="text-c-xs pd-2">You are signed in with <b>{user.email}</b></div>
         <br />
         <button onClick={() => signOut()}><LogOut /> Sign Out</button>
      </div>
   </div>)
}