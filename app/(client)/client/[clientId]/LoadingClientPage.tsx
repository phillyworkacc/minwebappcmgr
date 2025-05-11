'use client'

import "@/styles/home.css"
import Navbar from "@/components/Navbar/Navbar";
import SkeletonBox from "@/components/SkeletonBox/SkeletonBox";

export default function LoadingAddClientsPage() {
   return (<div className={`home-page light`}>
      <Navbar />
      <div className="app-content">
         <SkeletonBox size="1" /><br />
         <SkeletonBox size="1" /><br />
         <SkeletonBox size="1" /><br />
      </div>
   </div>)
}