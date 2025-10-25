'use client'
import LoadingCard from "@/components/Card/LoadingCard";
import Spacing from "@/components/Spacing/Spacing";

export default function LoadingPage () {
   return (
      <div className="app">
         <div className="content">
            <div className="content-wrapper">
               <Spacing size={1} />
               {Array.from({ length: 3 }, (_, i) => i+1).map((value, index) => (
                  <div className='box full' key={index}>
                     <LoadingCard styles={{
                        width: "100%",
                        height: "150px"
                     }} />
                     <Spacing size={1} />
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}
