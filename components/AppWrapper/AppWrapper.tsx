"use client"
import "@/styles/app.css"
import "./AppWrapper.css"
import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { CustomIcon, MinwebLogo } from '../Icons/Icon'
import userDefaultImage from "@/public/clientdefault.jpg"

export default function AppWrapper ({ children }: { children: ReactNode }) {
   const { data: session } = useSession();
   const router = useRouter();

   return (
      <div className="app">
         <div className="account-bar-wrapper">
            <div className="account-bar">
               <div className="app-icon">
                  <div className="app-icon-clickable" onClick={() => router.push("/")}>
                     <MinwebLogo size={40} />
                  </div>
               </div>
               <div className="account-image" onClick={() => router.push("/account")}>
                  <CustomIcon url={session?.user?.image! || userDefaultImage.src} size={40} round />
               </div>
            </div>
         </div>
         <div className="content">
            <div className="content-wrapper">
               <div className="box mb-05" />
               {children}
            </div>
         </div>
      </div>
   )
}