"use client"
import "./BackTick.css"
import { ReactNode } from "react"
import { ChevronLeft } from 'lucide-react'

type BackTickProps = {
   action: Function;
   children: ReactNode;
}

export default function BackTick({ action, children }: BackTickProps) {
   return (
      <div className='back-tick'>
         <div className="back" onClick={() => action()}><ChevronLeft size={20} /> {children}</div>
      </div>
   )
}
