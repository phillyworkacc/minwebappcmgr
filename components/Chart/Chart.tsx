'use client'
import { pluralSuffixer } from '@/lib/str';
import { formatNumber } from '@/utils/num';
import { CSSProperties, useEffect, useState } from 'react';
import { CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area, ResponsiveContainer, Customized } from 'recharts';
import { CustomUserIcon } from '../Icons/Icon';

type ChartSize = {
   width?: number;
   height?: number;
}

type ChartProps = {
   data: any;
   yDataKey: string;
   xDataKey: string;
   toolTipType: "client" | "revenue";
   xAxisInterval?: number;
   mobileChartSize?: ChartSize;
   desktopChartSize?: ChartSize;
}

export default function Chart({ data, yDataKey, xDataKey, xAxisInterval, toolTipType, mobileChartSize, desktopChartSize }: ChartProps) {
   const [width, setWidth] = useState(500)
   const [height, setHeight] = useState(250)

   function getDeviceType(navgtr: Navigator): 'mobile' | 'desktop' {
      const ua = navgtr.userAgent;
      if (/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
         return 'mobile';
      } else {
         return 'desktop';
      }
   }

   useEffect(() => {
      if (getDeviceType(navigator) == "mobile") {
         setHeight(mobileChartSize?.width || 200)
         setWidth(mobileChartSize?.height || 350)
      } else {
         setWidth(desktopChartSize?.width || 500)
         setHeight(desktopChartSize?.height || 250)
      }
   }, [])
   
   return (   
   <ResponsiveContainer width={"100%"} height={height}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>         
         <defs>
            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
               <stop offset="5%" stopColor="#1131ff" stopOpacity={0.35} />
               <stop offset="95%" stopColor="#1131ff" stopOpacity={0.05} />
            </linearGradient>
         </defs>

         <XAxis dataKey={xDataKey} tick={{ fontSize: '0.75rem' }} interval={xAxisInterval!} />
         <YAxis
            tick={{ fill: "#a3a3a3ff", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={35}
         />

         <Area 
            type="monotone"
            dataKey={yDataKey} 
            stroke="#1131ff" 
            fill="url(#colorUsers)"
            strokeWidth={getDeviceType(navigator) == "desktop" ? 1.3 : 1}
            dot={false}
            activeDot={{
               r: 6,
               stroke: "#fff",
               strokeWidth: 1,
               fill: "#1131ffc2",
            }}
         />
         
         <CartesianGrid 
            verticalValues={data.flatMap((dt: any) => dt.totalAmount)}
            strokeDasharray="4 4"
            vertical={false}
            stroke="#a3a3a3ff"
            opacity={0.85}
         />
         
         <Tooltip 
            content={<CustomTooltip 
               width={width} 
               xAxisKey={xDataKey} 
               toolTipType={toolTipType} 
               isMobile={(getDeviceType(navigator) == "mobile")}
            />}
            cursor={{ strokeWidth: 0.5, stroke: "#e6e6e6" }}
            wrapperStyle={{ marginLeft: 20, marginTop: -20 }}
         />
      </AreaChart>
   </ResponsiveContainer>
   )
}

function CustomTooltip ({ active, payload, coordinate, width, xAxisKey, toolTipType, isMobile }: any) {
   if (!active || !payload?.length) return null;
   
   const { x, y } = coordinate;

   const tooltipStyles: CSSProperties = {
      background: "rgba(255, 255, 255, 0.65)",
      backdropFilter: "blur(10px)",
      padding: "18px",
      borderRadius: "15px",
      width: "200px",
      boxShadow: "0 1px 5px rgba(0, 0, 0, 0.097)",
      position: "absolute",
      left: x > (width*0.60) ? x - 260 : x + 30, // 👈 add offset from cursor
      top: y > 90 ? 25 : y - 10,
      pointerEvents: "none",
      transition: "all 0.15s ease-out", // 👈 smooth slide
      transform: "translateY(0)"
   }

   if (isMobile) return <></>;
   if (toolTipType == "client") {
      const client: any = payload[0].payload;
      return (
         <div className="box h-fit" style={tooltipStyles}>
            <div className="text-xxxs grey-4 full mb-05">Clients Acquired</div>
            <div className="text-xxxs grey-4 full mb-05">{client.month}</div>
            <div className="text-m bold-700 full mb-1">{client.totalClients}</div>
            <div className="box mb-05" style={{opacity:0.2}}><hr /></div>
            {(client.clients.length == 0) && (<div className='text-xxxs full grey-5 pd-05'>No Clients</div>)}
            {client.clients.map((client: Client, index: number) => (
               <div key={index} className="box full dfb align-center gap-10 pd-05">
                  <div className="box fit h-full"><CustomUserIcon url={client.image} size={20} round /></div>
                  <div className="text-xxxs full grey-5">{client.name}</div>
               </div>
            ))}
         </div>
      )
   } else if (toolTipType == "revenue") {
      const payment: any = payload[0].payload;
      return (
         <div className="box h-fit" style={tooltipStyles}>
            <div className="text-xxxs grey-4 full mb-05">{payment[xAxisKey]} Payments</div>
            <div className="text-t grey-4 full mb-05">{payment.totalPayments} {pluralSuffixer("payment", payment.totalPayments, "s")}</div>
            <div className="text-m bold-700 full mb-1">{formatNumber(payment.totalAmount, {
               prefix: "£", useCommas: true, showDecimals: true, decimalPlaces: 2
            })}</div>
            <div className="box mb-05" style={{opacity:0.2}}><hr /></div>
            {(payment.clients.length == 0) && (<div className='text-xxxs full grey-5 pd-05'>No Payments</div>)}
            {payment.clients.map((client: ClientChartInfo, index: number) => (
               <div key={index} className="box full dfb align-center gap-10 pd-05">
                  <div className="box fit h-full"><CustomUserIcon url={client.image} size={25} round /></div>
                  <div className="box full dfb column">
                     <div className="text-xxxs full grey-5">{client.name}</div>
                     <div className="text-xt full" style={{color:"#15b100"}}>
                        {formatNumber(client.amountPaid, {
                           prefix: "+ £", useCommas: true, showDecimals: true, decimalPlaces: 2
                        })}
                     </div>
                  </div>
               </div>
            ))}
         </div>
      )
   }
}