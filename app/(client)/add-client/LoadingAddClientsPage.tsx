'use client'

import "@/styles/home.css"
import Navbar from "@/components/Navbar/Navbar";
import SkeletonBox from "@/components/SkeletonBox/SkeletonBox";

export default function LoadingAddClientsPage() {
   return (<div className={`home-page light`}>
      <Navbar page="clients" />
      <div className="app-content">
         <div className="text-c-xl bold-700 pd-2">Add Client</div>
         <SkeletonBox size="1" /><br />
         <SkeletonBox size="1" /><br />
         <SkeletonBox size="1" /><br />
      </div>
   </div>)
}