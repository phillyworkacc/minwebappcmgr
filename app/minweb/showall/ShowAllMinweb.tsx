'use client'

import "@/styles/home.css"
import { useSession } from 'next-auth/react'
import { useUser } from "@/app/context/UserContext";
import { useEffect, useState } from "react";
import { DetixIcon, InstagramIcon, MinwebIcon, MyPocketSkillIcon, SnapchatIcon, TikTokIcon } from "@/components/Icons/Icons";
import { getAllTimeTrackingData } from "@/app/Actions/UserTracking";
import { formatDateForMinwebAnalytic } from "@/utils/date";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import LoadingMinwebPage from "./LoadingShowAllMinweb";
import Card from "@/components/Card/Card";
import BackTick from "@/components/BackTick/BackTick";




const utmSourceToIcon = (utmsource: string) => {
   if (utmsource == "TikTok") return <TikTokIcon size={18} />;
   if (utmsource == "Mypocketskill") return <MyPocketSkillIcon size={18} />;
   if (utmsource == "Instagram") return <InstagramIcon size={18} />;
   if (utmsource == "Snapchat") return <SnapchatIcon size={18} />;
   return <></>;
}

export default function ShowAllMinwebPage() {
   const { data: session, status } = useSession();
   const { user } = useUser();
   const [userTrackingData, setUserTrackingData] = useState<UserTrackingData[] | null>(null);
   const router = useRouter();

   const loadAllTimeTrackingData = async () => {
      const trackingData = await getAllTimeTrackingData();
      if (!trackingData) return;
      setUserTrackingData(trackingData);
   }

   useEffect(() => {
      loadAllTimeTrackingData();
   }, [])

   if (status == "loading") return <LoadingMinwebPage />;
   if (!session?.user) return <LoadingMinwebPage />;
   if (!user) return <LoadingMinwebPage />;
   if (userTrackingData == null) return <LoadingMinwebPage />;

   return (<div className={`home-page ${user.color_theme}`}>
      <Navbar />
      <div className="app-content">

         <BackTick action={() => router.push('/minweb')}>Back to Analytics</BackTick>
         <div className="text-c-xxl bold-700 pd-2">All User Activity</div>
         <div className="text-c-s full dfbc left-align gap-10 pd-1">
            {userTrackingData.map((td, index) => {
               return <Card key={index}>
                  <div className="text-c-xs dfb gap-7 pd-1">
                     {(td.page == "Detix")
                        ? <><DetixIcon size={25} /> Detix</>
                        : <><MinwebIcon size={25} /> Minweb</>
                     }
                  </div>
                  <div className="text-c-xxs pd-1 grey">
                     A user visited the {td.page} website <b>{formatDateForMinwebAnalytic(parseInt(`${td.time}`))}</b>
                  </div>
                  {(td.utmsource !== "") ? <>
                     <div className="text-c-xxs grey dfb gap-5 flex-wrap">
                        <div className="text-c-xxs dfb gap-5">{utmSourceToIcon(td.utmsource)}<b>{td.utmsource}</b> brought this user</div>
                     </div>
                  </> : <></>}
                  <div className="text-c-s pd-0-5"></div>
               </Card>
            })}
         </div>

      </div>
   </div>)
}
