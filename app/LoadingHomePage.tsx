'use client'

import "@/styles/home.css"
import Navbar from "@/components/Navbar/Navbar";
import SkeletonBox from "@/components/SkeletonBox/SkeletonBox";
import AppLogoUserWelcome from "@/components/AppLogoUserWelcome/AppLogoUserWelcome";

export default function LoadingHomePage() {
   return (<div className={`home-page light`}>
      <Navbar page="home" />
      <div className="app-content">
         <AppLogoUserWelcome name={''} />
         <br />
         <div className="text-c-s pd-1">
            <SkeletonBox size="1" />
         </div>
         <SkeletonBox size="4" /><br /><br />
         <SkeletonBox size="10" /><br /><br />
         <SkeletonBox size="10" /><br /><br />
         <SkeletonBox size="10" /><br /><br />
         <SkeletonBox size="10" /><br /><br />
      </div>
   </div>)
}