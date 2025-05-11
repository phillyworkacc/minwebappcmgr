'use client'

import "@/styles/home.css"
import { useSession } from 'next-auth/react'
import { useUser } from "@/app/context/UserContext";
import { useEffect, useState } from "react";
import { CircleHelp, CircleX, Earth } from "lucide-react";
import { AndroidIcon, DesktopIcon, DetixIcon, InstagramIcon, IOSIcon, LinuxIcon, MacOSIcon, MinwebIcon, MobileIcon, MyPocketSkillIcon, SnapchatIcon, TikTokIcon, WindowsIcon } from "@/components/Icons/Icons";
import { getAllTimeTrackingData, getRecentTrackingData } from "../Actions/UserTracking";
import { useRouter } from "next/navigation";
import { formatDateForMinwebAnalytic } from "@/utils/date";
import Navbar from "@/components/Navbar/Navbar";
import LoadingMinwebPage from "./LoadingMinweb";
import Card from "@/components/Card/Card";
import BarProgress from "@/components/BarProgress/BarProgress";




const utmSourceToIcon = (utmsource: string) => {
   if (utmsource == "TikTok") return <TikTokIcon size={18} />;
   if (utmsource == "Mypocketskill") return <MyPocketSkillIcon size={18} />;
   if (utmsource == "Instagram") return <InstagramIcon size={18} />;
   if (utmsource == "Snapchat") return <SnapchatIcon size={18} />;
   return <CircleX size={18} />;
}

const filterTrackingDataLocation = (tdArray: UserTrackingData[], target: string) => {
   return tdArray.filter(td => td.location == target)
}

const filterTrackingDataUTMSource = (tdArray: UserTrackingData[], target: string) => {
   return tdArray.filter(td => td.utmsource == target)
}

const filterTrackingDataOs = (tdArray: UserTrackingData[], target: OS) => {
   return tdArray.filter(td => td.os == target)
}

const filterTrackingDataPage = (tdArray: UserTrackingData[], target: UserTrackingDataPage) => {
   return tdArray.filter(td => td.page == target)
}

export default function MinwebUserTackerPage() {
   const { data: session, status } = useSession();
   const { user } = useUser();
   const [userTrackingData, setUserTrackingData] = useState<UserTrackingData[] | null>(null);
   const [recentTrackingData, setRecentTrackingData] = useState<UserTrackingData[] | null>(null);
   const [availableCountries, setAvailableCountries] = useState<any[]>([])
   const [availableUTMSources, setAvailableUTMSources] = useState<any[]>([])
   const router = useRouter();

   //* devices analytics
   const [mobilePercent, setMobilePercent] = useState(0)
   const [desktopPercent, setDesktopPercent] = useState(0)
   
   //* page analytics
   const [minwebPercent, setMinwebPercent] = useState(0)
   const [detixPercent, setDetixPercent] = useState(0)

   //* os analytics
   const [windowsPercent, setWindowsPercent] = useState(0)
   const [macosPercent, setMacosPercent] = useState(0)
   const [iosPercent, setIosPercent] = useState(0)
   const [androidPercent, setAndroidPercent] = useState(0)
   const [linuxPercent, setLinuxPercent] = useState(0)
   const [unknownPercent, setUnknownPercent] = useState(0)

   const loadAllTimeTrackingData = async () => {
      const trackingData = await getAllTimeTrackingData();
      const recentTrackingData = await getRecentTrackingData();
      if (!trackingData) return;
      if (!recentTrackingData) return;

      const totalLength = trackingData.length;

      setAvailableCountries([...new Set(trackingData.map(td => td.location))])
      setAvailableUTMSources([...new Set(trackingData.map(td => td.utmsource))])

      //* devices analytics analysis
      setMobilePercent(((trackingData.filter((td) => td.device == "Mobile").length) / totalLength) * 100);
      setDesktopPercent(((trackingData.filter((td) => td.device == "Desktop").length) / totalLength) * 100);

      //* page analytics analysis
      setMinwebPercent(((filterTrackingDataPage(trackingData, "Minweb").length) / totalLength) * 100);
      setDetixPercent(((filterTrackingDataPage(trackingData, "Detix").length) / totalLength) * 100);

      //* os analytics analysis
      setWindowsPercent(((filterTrackingDataOs(trackingData, "Windows").length) / totalLength) * 100);
      setMacosPercent(((filterTrackingDataOs(trackingData, "macOS").length) / totalLength) * 100);
      setIosPercent(((filterTrackingDataOs(trackingData, "iOS").length) / totalLength) * 100);
      setAndroidPercent(((filterTrackingDataOs(trackingData, "Android").length) / totalLength) * 100);
      setLinuxPercent(((filterTrackingDataOs(trackingData, "Linux").length) / totalLength) * 100);
      setUnknownPercent(((filterTrackingDataOs(trackingData, "Unknown").length) / totalLength) * 100);
      
      setUserTrackingData(trackingData);
      setRecentTrackingData(recentTrackingData);
   }

   useEffect(() => {
      loadAllTimeTrackingData();

   }, [])

   if (status == "loading") return <LoadingMinwebPage />;
   if (!session?.user) return <LoadingMinwebPage />;
   if (!user) return <LoadingMinwebPage />;
   if (userTrackingData == null) return <LoadingMinwebPage />;
   if (recentTrackingData == null) return <LoadingMinwebPage />;

   return (<div className={`home-page ${user.color_theme}`}>
      <Navbar page="minweb-detix-website" />
      <div className="app-content">

         <div className="text-c-xxl bold-700 pd-2">Minweb User Tracker</div>
         <div className="card-section">
            <Card>
               <div className="text-c-m bold-600 pd-1">Devices</div>
               <div className="text-c-s full dfbc gap-5 pd-1">
                  <BarProgress size={mobilePercent}><MobileIcon size={18} /> Mobile</BarProgress>
                  <BarProgress size={desktopPercent}><DesktopIcon size={18} /> Desktop</BarProgress>
               </div>
            </Card>

            <Card>
               <div className="text-c-m bold-600 pd-1">Page</div>
               <div className="text-c-s full dfbc gap-5 pd-1">
                  <BarProgress size={minwebPercent}><MinwebIcon size={18} /> Minweb</BarProgress>
                  <BarProgress size={detixPercent}><DetixIcon size={18} /> Detix</BarProgress>
               </div>
            </Card>

            <Card>
               <div className="text-c-m bold-600 pd-1">Locations</div>
               <div className="text-c-s full dfbc gap-5 pd-1">
                  {availableCountries.map((availableCountry, index) => {
                     return <BarProgress 
                        key={index} 
                        size={((filterTrackingDataLocation(userTrackingData, availableCountry).length / userTrackingData.length) * 100)}
                     >
                        <Earth size={18} /> {availableCountry}
                     </BarProgress>
                  })}
               </div>
            </Card>
         </div>

         <div className="card-section">
            <Card>
               <div className="text-c-m bold-600 pd-1">UTM Sources</div>
               <div className="text-c-s full dfbc gap-5 pd-1">
                  {availableUTMSources.map((availableUTMSource, index) => {
                     return <BarProgress 
                        key={index} 
                        size={((filterTrackingDataUTMSource(userTrackingData, availableUTMSource).length / userTrackingData.length) * 100)}
                     >
                        {utmSourceToIcon(availableUTMSource)} {(availableUTMSource == "") ? 'None' : availableUTMSource}
                     </BarProgress>
                  })}
               </div>
            </Card>
            <Card>
               <div className="text-c-m bold-600 pd-1">Operating System</div>
               <div className="text-c-s full dfbc gap-5 pd-1">
                  <BarProgress size={windowsPercent}><WindowsIcon size={18} /> Windows</BarProgress>
                  <BarProgress size={iosPercent}><IOSIcon size={18} /> iOS</BarProgress>
                  <BarProgress size={macosPercent}><MacOSIcon size={18} /> MacOS</BarProgress>
                  <BarProgress size={androidPercent}><AndroidIcon size={18} /> Android</BarProgress>
                  <BarProgress size={linuxPercent}><LinuxIcon size={18} /> Linux</BarProgress>
                  <BarProgress size={unknownPercent}><CircleHelp size={18} /> Unknown</BarProgress>
               </div>
            </Card>
         </div>

         <br /><br />

         <div className="text-c-l bold-600 pd-1">Recent Visits</div>
         <div className="text-c-s full dfbc left-align gap-13 pd-1">
            {recentTrackingData.map((td, index) => {
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
         <div className="text-c-xxs grey pd-2">
            <button className="outline-black" onClick={() => router.push('/minweb/showall')}>Show all ({userTrackingData.length} results)</button>
         </div>
         
      </div>
   </div>)
}
