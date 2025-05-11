'use client'

import "@/styles/home.css"
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import SkeletonBox from "@/components/SkeletonBox/SkeletonBox";
import Card from "@/components/Card/Card";
import BackTick from "@/components/BackTick/BackTick";

export default function LoadingShowAllPaymentsPage() {
   const router = useRouter();
   return (<div className={`home-page light`}>
      <Navbar />
      <div className="app-content">
         <BackTick action={() => router.push('/payments')}>Back to Payments</BackTick>
         <div className="text-c-xxl bold-700 pd-2">All Payments</div>
         <div className="text-c-s dfbc gap-10 left-align">
            <Card>
               <SkeletonBox margin size="1" />
               <SkeletonBox margin size="1" />
            </Card>
            <Card>
               <SkeletonBox margin size="1" />
               <SkeletonBox margin size="1" />
            </Card>
            <Card>
               <SkeletonBox margin size="1" />
               <SkeletonBox margin size="1" />
            </Card>
         </div>
      </div>
   </div>)
}