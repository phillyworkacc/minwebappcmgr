'use client'

import { appLogo } from '@/utils/constants';
import './Navbar.css'
import { useUser } from "@/app/context/UserContext";
import { CircleUserRound, Contact, Globe, House, Wallet } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from 'next/link';

type NavbarPage = 'home' | 'payments' | 'clients' | 'minweb-detix-website' | 'account'
type NavbarProps = {
   page?: NavbarPage;
}

export default function Navbar({ page }: NavbarProps) {
   const { data: session, status } = useSession();
   const { user } = useUser();

   return (<div className="navbar">
      <div className="app-branding">
         <img src={appLogo} alt="app logo" />
      </div>
      <Link href='/'>
         <div className={`item ${page == "home" ? 'selected' : ''}`}>
            <div className="icon"><House size={18} /></div>
            <div className="label">Home</div>
         </div>
      </Link>
      <Link href='/payments'>
         <div className={`item ${page == "payments" ? 'selected' : ''}`}>
            <div className="icon"><Wallet size={18} /></div>
            <div className="label">Payments</div>
         </div>
      </Link>
      <Link href='/clients'>
         <div className={`item ${page == "clients" ? 'selected' : ''}`}>
            <div className="icon"><Contact size={18} /></div>
            <div className="label">Clients</div>
         </div>
      </Link>
      <Link href='/minweb'>
         <div className={`item ${page == "minweb-detix-website" ? 'selected' : ''}`}>
            <div className="icon"><Globe size={18} /></div>
            <div className="label">MinWeb</div>
         </div>
      </Link>
      <Link href='/account'>
         <div className={`item ${page == "account" ? 'selected' : ''}`}>
            <div className="icon"><CircleUserRound size={18} /></div>
            <div className="label">Account</div>
         </div>
      </Link>
   </div>)
}
