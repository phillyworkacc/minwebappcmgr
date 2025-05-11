'use client'

import './ClientSkeleton.css'
import SkeletonBox from '../SkeletonBox/SkeletonBox';

export default function ClientSkeleton() {

   return (
      <div className="client-skeleton">
         <div className="image">
            <div className="img-skeleton"></div>
         </div>
         <div className="name text-c-xs bold-500"><SkeletonBox size='1' /></div>
         <div className="status"><SkeletonBox size='1' /></div>
      </div>
   )
}
