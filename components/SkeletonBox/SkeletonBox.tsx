'use client'

import './SkeletonBox.css'

export default function SkeletonBox({ size, margin }: { size?: string, margin?: boolean }) {
   return (
      <div 
         className={`skeleton s${size || 1}`}
         style={{ margin: margin ? '10px 0': '' }}
      ></div>
   )
}
