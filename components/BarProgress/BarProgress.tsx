'use client'

import './BarProgress.css'
import { ReactNode } from 'react';

type BarProgressProps = {
   children: ReactNode;
   size: number;
}

export default function BarProgress({ children, size }: BarProgressProps) {
   return (
      <div className='bar-progress'>
         <div 
            className="progress" 
            style={{
               width: `${size.toFixed(1)}%`, 
               display: (Math.round(size) < 1) ? 'none' : 'block' 
         }}></div>
         <div className="label text-c-xxxs">{children} ({size.toFixed(1)}%)</div>
      </div>
   )
}
