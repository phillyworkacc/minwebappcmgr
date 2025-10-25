'use client'
import './Card.css'
import { ReactNode } from 'react';

type ToolCardProps = {
   idClassName: string;
   children: ReactNode;
}

export default function ToolCard ({ idClassName, children }: ToolCardProps) {
   return (
      <div className={`tool-card ${idClassName}`}>
         {children}
      </div>
   )
}
