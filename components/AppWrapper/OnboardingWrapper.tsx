"use client"
import "./AppWrapper.css"
import "@/styles/app.css"
import { ReactNode } from 'react'
import { MinwebLogo } from '../Icons/Icon'

export default function OnboardingWrapper ({ children }: { children: ReactNode }) {
   return (
      <div className="app">
         <div className="account-bar-wrapper">
            <div className="account-bar">
               <div className="app-icon">
                  <div className="app-icon-clickable">
                     <MinwebLogo size={40} />
                  </div>
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