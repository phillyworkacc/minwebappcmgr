'use client'

import { ReactNode } from 'react';
import './LogoText.css'

type LogoTextProps = {
   children: ReactNode;
   image: string;
}

export default function LogoText({ image, children }: LogoTextProps) {
   return (
      <div className="logo-text">
         <div className="icon"><img src={image} alt="image" /></div>
         <div className="user text-c-s">{children}</div>
      </div>
   )
}
