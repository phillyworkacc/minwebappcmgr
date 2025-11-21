'use client'
import './DateTimeSelector.css'
import { useState } from 'react';

type DateTimeSelectorProps = {
   onSelect: (ms: string) => void;
}

export default function DateTimeSelector({ onSelect }: DateTimeSelectorProps) {
   const [value, setValue] = useState('');

   function handleSet(dt: any) {
      setValue(dt)
      // datetime-local yields a local date-time string like "2025-11-21T14:30"
      // new Date(value) treats that as local time in browsers — this gives epoch ms.
      const ms = new Date(dt).getTime();
      onSelect(`${ms}`);
   }

   return (
      <div className="dt-root">
         <input
            className="dt-input xs"
            type="datetime-local"
            value={value}
            onChange={(e) => handleSet(e.target.value)}
         />
      </div>
   );
}
