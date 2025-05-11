'use client'

import "@/styles/home.css"
import Navbar from "@/components/Navbar/Navbar";
import SkeletonBox from "@/components/SkeletonBox/SkeletonBox";
import Card from "@/components/Card/Card";

export default function LoadingMinwebPage() {
   return (<div className={`home-page light`}>
      <Navbar page="minweb-detix-website" />
      <div className="app-content">
         <div className="text-c-xxl bold-700 pd-2">Minweb User Tracker</div>
         
         <div className="card-section">
            <Card>
               <SkeletonBox margin size="1" />
               <SkeletonBox margin size="1" />
               <SkeletonBox margin size="1" />
               <SkeletonBox margin size="1" />
            </Card>
            <Card>
               <SkeletonBox margin size="1" />
               <SkeletonBox margin size="1" />
               <SkeletonBox margin size="1" />
               <SkeletonBox margin size="1" />
            </Card>
            <Card>
               <SkeletonBox margin size="1" />
               <SkeletonBox margin size="1" />
               <SkeletonBox margin size="1" />
               <SkeletonBox margin size="1" />
            </Card>
         </div>
      </div>
   </div>)
}