'use client'
import Card from "@/components/Card/Card"
import Select from "@/components/Select/Select"
import { formatNumber } from "@/utils/num"
import { CalendarClock, CircleUser, TrendingUp } from "lucide-react"
import { CSSProperties, useEffect, useState } from "react"

type VisibleMetricsProps = {
   clients: Client[];
   payments: Payment[];
}

const visualMetricsFuncs = {
   calculateMRR: (payments: Payment[]) => {
      const monthlyRevenue: Record<string, number> = {};
      for (const payment of payments) {
         const date = new Date(parseInt(payment.date));
         const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}`;

         const amount = parseFloat(payment.amount) || 0;
         monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + amount;
      }
      const latestMonth = Object.keys(monthlyRevenue).sort().pop();
      return latestMonth ? monthlyRevenue[latestMonth] : 0;
   },
   averageProjectDuration: (clients: Client[]) => {
      const finished = clients.filter(c => c.status === "finished");
      if (finished.length === 0) return 0;
      const totalDuration = finished.reduce((acc, curr) => {
         const start = parseInt(curr.createdat)
         const end = parseInt(curr.latestupdate)
         return acc + Math.max(0, end - start); // prevent negatives
      }, 0);

      const avgMs = totalDuration / finished.length;
      const avgDays = avgMs / (1000 * 60 * 60 * 24); // convert ms → days
      return avgDays;
   }
}

export default function VisibleMetrics ({ clients, payments }: VisibleMetricsProps) {
   const metricCardStyle: CSSProperties = {
      padding: "25px", boxShadow: "0 1px 3px rgba(0,0,0,0.098)"
   }

   const [revenueCardValue, setRevenueCardValue] = useState(0);
   const [clientCardValue, setClientCardValue] = useState(0);

   useEffect(() => {
      setRevenueCardValue(payments.reduce((acc, curr) => acc + parseFloat(curr.amount), 0))
      setClientCardValue(clients.length)
   }, [])

   const onSelectRevenueStat = (option: string) => {
      if (option == 'Total Revenue') {
         setRevenueCardValue(payments.reduce((acc, curr) => acc + parseFloat(curr.amount), 0))
      } else if (option == 'Average Payment') {
         setRevenueCardValue(payments.reduce((acc, curr) => acc + parseFloat(curr.amount), 0) / payments.length)
      } else {
         setRevenueCardValue(visualMetricsFuncs.calculateMRR(payments))
      }
   }

   const onSelectClientStat = (option: string) => {
      if (option == 'Total Clients') {
         setClientCardValue(clients.length)
      } else if (option == 'Active Clients') {
         setClientCardValue(clients.filter(c => (["working","beginning"].includes(c.status))).length)
      } else if (option == 'Completed') {
         setClientCardValue(clients.filter(c => (c.status === "finished")).length)
      } else {
         setClientCardValue(clients.filter(c => (c.status === "failed")).length)
      }
   }

   return (
      <>
         <div className="htv gap-10">
            <Card styles={metricCardStyle}>
               <div className="htv">
                  <div className="text-xxs bold-500 full dfb align-start gap-8">
                     <RevenueIcon />
                     Revenue
                  </div>
                  <div className="box full dfb align-center justify-end">
                     <Select
                        options={['Total Revenue', 'Monthly Revenue', 'Average Payment']}
                        onSelect={onSelectRevenueStat}
                        style={{ width: "fit-content", fontSize: "0.85rem", boxShadow:"0 1px 3px rgba(0,0,0,0.097)" }}
                        optionStyle={{ padding:"8px 12px" }}
                        selectedOptionStyle={{width:"fit-content",fontSize: "0.85rem"}}
                     />
                  </div>
               </div>
               <div className="text-ml pd-05 full bold-700">{
                  formatNumber(revenueCardValue, {
                     prefix: "£", useCommas: true, showDecimals: true, decimalPlaces: 2
                  })
               }</div>
            </Card>

            <Card styles={metricCardStyle}>
               <div className="htv">
                  <div className="text-xxs bold-500 full whitespace-nowrap dfb align-start gap-8">
                     <ClientsIcon />
                     Client Stats
                  </div>
                  <div className="box full dfb align-center justify-end">
                     <Select
                        options={['Total Clients', 'Active Clients', 'Completed', 'Failed']}
                        onSelect={onSelectClientStat}
                        style={{ width: "fit-content", fontSize: "0.85rem", boxShadow:"0 1px 3px rgba(0,0,0,0.097)" }}
                        optionStyle={{ padding:"8px 12px" }}
                        selectedOptionStyle={{width:"fit-content",fontSize: "0.85rem"}}
                     />
                  </div>
               </div>
               <div className="text-ml pd-05 full bold-700">{
                  formatNumber(clientCardValue, { useCommas: true })
               }</div>
            </Card>
         </div>
         <div className="htv mt-1">
            <Card styles={metricCardStyle}>
               <div className="text-xxs bold-500 full whitespace-nowrap dfb align-center gap-8">
                  <APDIcon />
                  Average Project Duration
               </div>
               <div className="text-ml pd-05 full bold-700">{
                  formatNumber(visualMetricsFuncs.averageProjectDuration(clients), { showDecimals: false })
               } days</div>
            </Card>
         </div>
      </>
   )
}

function RevenueIcon () {
   return (<>
      <div 
         className="box fit h-fit pd-05 pdx-05 dfb align-center justify-center"
         style={{ aspectRatio: '1', borderRadius: "100%", background: "#8704a8", color: "white" }}
      >
         <TrendingUp size={12} />
      </div>
   </>)
}

function ClientsIcon () {
   return (<>
      <div 
         className="box fit h-fit pd-05 pdx-05 dfb align-center justify-center"
         style={{ aspectRatio: '1', borderRadius: "100%", background: "#880224", color: "white" }}
      >
         <CircleUser size={12} />
      </div>
   </>)
}

function APDIcon () {
   return (<>
      <div 
         className="box fit h-fit pd-05 pdx-05 dfb align-center justify-center"
         style={{ aspectRatio: '1', borderRadius: "100%", background: "#00b39b", color: "white" }}
      >
         <CalendarClock size={12} />
      </div>
   </>)
}