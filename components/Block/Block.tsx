'use client'
import './Block.css'

type BlockProps = {
   header: string;
   children: string;
   action?: () => void;
}

export default function Block({ header, children, action }: BlockProps) {
   return (
      <div className='block' onClick={action ? () => action() : () => {}}>
         <div className="text-c-sm bold-700">{header}</div>
         <div className="text-c-xs grey">{children}</div>
      </div>
   )
}
