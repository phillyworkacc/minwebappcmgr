'use client'
import { titleCase } from '@/lib/str'
import { clientStatusInfo } from '@/utils/funcs'

export default function ClientStatusIndicator ({ status }: { status: ClientStatus; }) {
   return (
      <div className="box full dfb align-center justify-center">
         <div 
            className='box dfb align-center justify-center fit text-xt'
            style={{
               background: `${clientStatusInfo(status)?.color}3d`,
               color: `${clientStatusInfo(status)?.color}`,
               border: `1px solid ${clientStatusInfo(status)?.color}`,
               borderRadius: "10px",
               padding: "3px 8px"
            }}
         >
            {titleCase(status)}
         </div>
      </div>
   )
}

export function ClientStatusIndicatorFit ({ status }: { status: ClientStatus; }) {
   return (
      <div className="box fit dfb align-center justify-center">
         <div 
            className='box dfb align-center justify-center fit text-xt'
            style={{
               background: `${clientStatusInfo(status)?.color}3d`,
               color: `${clientStatusInfo(status)?.color}`,
               border: `1px solid ${clientStatusInfo(status)?.color}`,
               borderRadius: "10px",
               padding: "3px 8px"
            }}
         >
            {titleCase(status)}
         </div>
      </div>
   )
}
