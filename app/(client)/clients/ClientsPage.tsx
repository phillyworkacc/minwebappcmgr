'use client'

import "@/styles/home.css"
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar/Navbar';
import Client from "@/components/Client/Client";
import { useSession } from 'next-auth/react';
import { useUser } from '../../context/UserContext';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getAllUserClients } from '../../Actions/Clients';
import LoadingClientsPage from "./LoadingClientsPage";
import ClientSkeleton from "@/components/ClientSkeleton/ClientSkeleton";

export default function ClientsPage() {
   const { data: session, status } = useSession();
   const { user } = useUser();
   const router = useRouter();
   const [search, setSearch] = useState("")
   const [userClients, setUserClients] = useState<Client[] | null>(null)

   const linkToAddClientLink = () => router.push('/add-client');

   const loadAllUserClients = async () => {
      const allClients = await getAllUserClients();
      setUserClients(allClients ? allClients : []);
   }

   useEffect(() => {
      loadAllUserClients();
   }, [])

   if (status == "loading") return <LoadingClientsPage />;
   if (!session?.user) return <LoadingClientsPage />;
   if (!user) return <LoadingClientsPage />;

   return (<div className={`home-page ${user.color_theme}`}>
      <Navbar page="clients" />
      <div className="app-content">
         <div className="text-c-xl bold-700 pd-2">Clients</div>
         <div className="text-c-s dfb gap-5">
            <div className="text-c-s flex-fill grey">
               <input 
                  type="text" 
                  className='full' 
                  placeholder='Search' 
                  style={{ padding: "9px 15px" }} 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} />
            </div>
            <button onClick={linkToAddClientLink}><Plus /></button>
         </div>
         {(userClients == null) ? <>
            <br />
            <ClientSkeleton />
            <ClientSkeleton />
            <ClientSkeleton />
         </> : (userClients.length > 0) ? <>
            <div className="client-list">
               {userClients
               .filter((cl) => cl.name.toLowerCase().includes(search.toLowerCase()))
               .sort((a, b) => parseInt(b.latestupdate) - parseInt(a.latestupdate))
               .map((userClient, index) => {
                  return <Client key={index} client={userClient} />
               })}
            </div>
         </> : <>
            <div className="text-c-s dfbc pd-3">
               <div className="text-c-xs pd-1 grey text-center">You have no clients, start booking, looking and searching for clients. Once you have a client click below to add them to your client manager.</div>
               <button onClick={linkToAddClientLink}>Create Client</button>
            </div>
         </>}
      </div>
   </div>)
}
