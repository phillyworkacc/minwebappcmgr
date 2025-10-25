'use client'
import { CSSProperties, ReactNode } from "react";
import "./Card.css"

type CardProps = {
   children: ReactNode;
   styles?: CSSProperties;
   className?: string;
   cursor?: boolean;
   onClick?: Function;
}

export default function Card({ children, className, cursor, onClick, styles }: CardProps) {
   return (
      <div 
         className={`card ${className}`}
         style={styles}
         onClick={() => onClick ? onClick() : {}}
      >{children}</div>
   )
}
