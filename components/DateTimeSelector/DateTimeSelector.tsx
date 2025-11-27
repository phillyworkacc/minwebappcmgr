'use client'
import './DateTimeSelector.css'
import { useState } from 'react';

type DateTimeSelectorProps = {
   defaultTime?: string;
   onSelect: (ms: string) => void;
}

function msToDateTimeLocal(ms: number) {
   const d = new Date(ms);
   const pad = (n: number) => String(n).padStart(2, "0");
   return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function DateTimeSelector({ onSelect, defaultTime }: DateTimeSelectorProps) {
   const [value, setValue] = useState(defaultTime ? msToDateTimeLocal(parseInt(defaultTime)) : '');

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
