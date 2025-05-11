'use client'

import { getDeviceType } from '@/utils/device';
import { useEffect, useState } from 'react';
import { CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';

type ChartProps = {
   data: any;
   userColorTheme: ColorTheme;
   yDataKey: string;
   xDataKey: string;
}

export default function Chart({ data, yDataKey, xDataKey, userColorTheme }: ChartProps) {
   const [width, setWidth] = useState(500)
   const [height, setHeight] = useState(250)

   useEffect(() => {
      if (getDeviceType(navigator) == "mobile") {
         setHeight(200)
         setWidth(340)
      } else {
         setHeight(250)
         setWidth(500)
      }
   }, [])

   return (
      <AreaChart width={width} height={height} data={data} margin={{ left: -60, right: 10 }}>
         <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
               <stop offset="5%" stopColor="currentColor" stopOpacity={0.3} />
               <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
            </linearGradient>
         </defs>

         <Area 
            type="monotone" 
            dataKey={yDataKey} 
            stroke="#236cff" 
            fill="#236cff1c" 
            strokeWidth={1} 
            dot={false} />

         <XAxis dataKey={xDataKey} padding={{ left: 15 }} tick={{ fontSize: '0.9rem' }} />
         <YAxis dataKey={yDataKey} tick={false} tickLine />
         
         <CartesianGrid verticalValues={data.flatMap((dt: any) => dt.value)} />
         
         <Tooltip cursor={{
            strokeWidth: 0.5,
            stroke: userColorTheme == "dark" ? "#ffffff" : "#ccc"
         }} />
      </AreaChart>
   )
}
