'use client'

import "@/styles/home.css"
import Navbar from "@/components/Navbar/Navbar";
import SkeletonBox from "@/components/SkeletonBox/SkeletonBox";

export default function LoadingAccountPage() {
   return (<div className={`home-page light`}>
      <Navbar page="account" />
      <div className="app-content">
         <SkeletonBox size="1" />
         <br />
         <div className="text-c-s pd-1">
            <SkeletonBox size="1" />
         </div>
         <SkeletonBox size="4" />
      </div>
   </div>)
}