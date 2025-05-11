'use client'

import "@/styles/home.css"
import Navbar from "@/components/Navbar/Navbar";
import SkeletonBox from "@/components/SkeletonBox/SkeletonBox";
import ClientSkeleton from "@/components/ClientSkeleton/ClientSkeleton";

export default function LoadingClientsPage() {
   return (<div className={`home-page light`}>
      <Navbar page="clients" />
      <div className="app-content">
         <div className="text-c-xl bold-700 pd-2">Clients</div>
         <div className="text-c-xl full">
            <SkeletonBox size="1" />
         </div>
         <div className="client-list">
            <ClientSkeleton />
            <ClientSkeleton />
            <ClientSkeleton />
         </div>
      </div>
   </div>)
}