'use client'
import Card from "@/components/Card/Card"
import Chart from "@/components/Chart/Chart"
import Top5ClientsTable from "@/components/Table/Top5ClientsTable"
import { ClientStatusIndicatorFit } from "@/components/ClientStatusIndicator/ClientStatusIndicator"
import { formatNumber } from "@/utils/num"
import { ArrowDown, ArrowUp, CalendarClock, CircleUser, TrendingUp, UserRoundCheck } from "lucide-react"
import { CSSProperties } from "react"

type CalculatedMetricsProps = {
   clients: Client[];
   payments: Payment[];
}

const calculatedMetricsFuncs = {
   calculateRevenueGrowthRate: (payments: Payment[]) => {
      if (!payments.length) return 0;

      // Group payments by year-month
      const revenueByMonth: Record<string, number> = {};

      for (const payment of payments) {
         const d = new Date(parseInt(payment.date));
         const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
         const amount = parseFloat(payment.amount) || 0;
         revenueByMonth[key] = (revenueByMonth[key] || 0) + amount;
      }

      const months = Object.keys(revenueByMonth).sort(); // chronological
      if (months.length < 2) return 0; // not enough data

      const lastMonth = months[months.length - 2];
      const currentMonth = months[months.length - 1];

      const prevRevenue = revenueByMonth[lastMonth] || 0;
      const currRevenue = revenueByMonth[currentMonth] || 0;

      if (prevRevenue === 0) return 0; // avoid division by zero

      const growthRate = ((currRevenue - prevRevenue) / prevRevenue) * 100;
      return growthRate
   },
   revenuePerClient: (payments: Payment[], clients: Client[]) => {
      const totalRevenue = payments.reduce((agg,curr) => (agg + parseFloat(curr.amount)), 0);
      return totalRevenue / clients.length
   },
   averagePaymentFrequency: (payments: Payment[], clients: Client[]) => {
      const paymentFreqClient = clients.map(client => {
         const clientPayments = payments.filter(p => (p.clientid == client.clientid)).sort(
            (a,b) => parseInt(a.date) - parseInt(b.date)
         );

         let totalGap = 0;
         if (clientPayments.length < 2) return {
            client: client.name,
            avgFrequency: (clientPayments.length == 1)
               ? `${(parseInt(clientPayments[0].date) - parseInt(client.createdat)) / (1000 * 60 * 60 * 24)}`
               : '0',
         }

         for (let i = 1; i < clientPayments.length; i++) {
            const previousPaymentDate = parseInt(clientPayments[i-1].date);
            const currentPaymentDate = parseInt(clientPayments[i].date);
            totalGap += (currentPaymentDate - previousPaymentDate) / (1000 * 60 * 60 * 24);
         }

         return {
            client: client.name,
            avgFrequency: `${totalGap / (clientPayments.length-1)}`
         }
         
      })
      const payingClients = paymentFreqClient.filter(c => c.avgFrequency !== '0');
      const totalFreq = payingClients.reduce((agg, curr) => agg + parseFloat(curr.avgFrequency), 0);
      return totalFreq/(payingClients.length)
   },
   getTop5PayingClients: (payments: Payment[], clients: Client[]) => {
      const clientsPayments = clients.map(client => {
         const paymentsMadeByClient = payments.filter(p => p.clientid == client.clientid);
         const totalPaid = paymentsMadeByClient.reduce((total, payment) => total + parseFloat(payment.amount), 0);
         
         return {
            client: client,
            totalPaid,
            paymentsMade: paymentsMadeByClient.length
         }
      });
      return clientsPayments.sort((a, b) => b.totalPaid - a.totalPaid).slice(0,5);
   },
   revenueFromClientStatus: (payments: Payment[], clients: Client[], statuses: ClientStatus[]) => {
      const clientsPayments = clients.map(client => {
         const paymentsMadeByClient = payments.filter(p => p.clientid == client.clientid);
         const totalPaid = paymentsMadeByClient.reduce((total, payment) => total + parseFloat(payment.amount), 0);
         return {
            client: client,
            totalPaid
         }
      });
      const clientsFromStatus = clientsPayments.filter(cp => statuses.includes(cp.client.status));
      return clientsFromStatus.reduce((total, cp) => total + cp.totalPaid, 0);
   },
   calculateClientAcquisitionRate: (clients: Client[]) => {
      if (!clients.length) return 0;

      // Group clients by year-month of creation
      const clientsByMonth: Record<string, number> = {};
      for (const c of clients) {
         const d = new Date(c.createdat);
         const key = `${d.getFullYear()}-${(d.getMonth() + 1)
            .toString()
            .padStart(2, "0")}`;
         clientsByMonth[key] = (clientsByMonth[key] || 0) + 1;
      }

      const months = Object.keys(clientsByMonth).sort();
      if (months.length < 2) return 0; // need at least 2 months

      const prevMonth = months[months.length - 2];
      const currentMonth = months[months.length - 1];

      const prevCount = clientsByMonth[prevMonth] || 0;
      const currCount = clientsByMonth[currentMonth] || 0;

      if (prevCount === 0) return 0; // avoid division by zero

      const growthRate = ((currCount - prevCount) / prevCount) * 100;
      return Number(growthRate.toFixed(2));
   }
}

const deeperMetricsFuncs = {
   getClientsPerMonth: (clients: Client[]): { month: string; totalClients: number; clients: Client[]; }[] => {
      const months = [
         "Jan", "Feb", "Mar", "Apr", "May", "Jun",
         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];

      // Group clients by month + year (e.g. "Oct 24")
      const grouped: Record<string, Client[]> = {};

      clients.forEach(client => {
         const dateObj = new Date(parseInt(client.createdat));
         const monthName = months[dateObj.getMonth()];
         const yearShort = dateObj.getFullYear().toString().slice(-2); // "2025" -> "25"
         const key = `${monthName} ${yearShort}`;

         if (!grouped[key]) grouped[key] = [];
         grouped[key].push(client);
      });

      // Sort keys by actual date order
      const sortedKeys = Object.keys(grouped).sort((a, b) => {
         const [monthA, yearA] = a.split(" ");
         const [monthB, yearB] = b.split(" ");
         const dateA = new Date(`20${yearA}-${months.indexOf(monthA) + 1}-01`).getTime();
         const dateB = new Date(`20${yearB}-${months.indexOf(monthB) + 1}-01`).getTime();
         return dateA - dateB;
      });

      // Convert to chart-ready format
      return sortedKeys.map(key => ({
         month: key,
         totalClients: grouped[key].length,
         clients: grouped[key],
      }));
   }
}

export default function CalculatedMetrics ({ clients, payments }: CalculatedMetricsProps) {
   const metricCardStyle: CSSProperties = {
      padding: "25px", boxShadow: "0 1px 3px rgba(0,0,0,0.098)"
   }

   return (
      <>
         <div className="box mb-2">
            <div className="text-xxs bold-500 full whitespace-nowrap dfb align-center gap-8">
               Client Acquisition
            </div>
            <div className="box full h-fit mt-1">
               <Chart
                  data={deeperMetricsFuncs.getClientsPerMonth(clients)}
                  xDataKey="month"
                  yDataKey="totalClients"
                  xAxisInterval={1}
                  toolTipType="client"
               />
            </div>
         </div>

         <div className="htv gap-10">
            <Card styles={metricCardStyle}>
               <div className="text-xxs bold-500 full whitespace-nowrap dfb align-center gap-8">
                  <RevenueIcon />
                  Revenue Growth Rate
               </div>
               <div className="text-ml pd-05 full bold-700">
                  {(calculatedMetricsFuncs.calculateRevenueGrowthRate(payments) >= 0) ? (<>
                     <div className="text-ml bold-700 dfb align-center gap-8" style={{ color:"#47ec1d"}}>
                        {formatNumber(calculatedMetricsFuncs.calculateRevenueGrowthRate(payments), {
                           showDecimals: true, decimalPlaces: 2
                        })}%
                        <div className="box fit h-full dfb align-end justify-center">
                           <ArrowUp size={20} strokeWidth={3} />
                        </div>
                     </div>
                  </>) : (<>
                     <div className="text-ml bold-700 dfb align-center gap-8" style={{ color:"#ff2b2b"}}>
                        {formatNumber(calculatedMetricsFuncs.calculateRevenueGrowthRate(payments), {
                           showDecimals: true, decimalPlaces: 2
                        })}%
                        <div className="box fit h-full dfb align-end justify-center">
                           <ArrowDown size={20} strokeWidth={3} />
                        </div>
                     </div>
                  </>)}
               </div>
            </Card>

            <Card styles={metricCardStyle}>
               <div className="text-xxs bold-500 full whitespace-nowrap dfb align-center gap-8">
                  <RevenuePerClientIcon />
                  Revenue Per Client
               </div>
               <div className="text-ml pd-05 full bold-700">
                  {formatNumber(calculatedMetricsFuncs.revenuePerClient(payments, clients), {
                     prefix: '£', useCommas: true, showDecimals: true, decimalPlaces: 2
                  })}
               </div>
            </Card>

            <Card styles={metricCardStyle}>
               <div className="text-xxs bold-500 full whitespace-nowrap dfb align-center gap-8">
                  <APFIcon />
                  Average Payment Frequency
               </div>
               <div className="text-ml pd-05 full bold-700">
                  {formatNumber(calculatedMetricsFuncs.averagePaymentFrequency(payments, clients), {
                     prefix: '', useCommas: true, showDecimals: true, decimalPlaces: 2
                  })} days
               </div>
            </Card>
         </div>

         <div className="htv gap-10 mt-1">
            <Card styles={metricCardStyle}>
               <div className="text-xxs bold-500 full whitespace-nowrap dfb align-center gap-8 mb-15">
                  <ClientsIcon />
                  Top Paying Clients
               </div>
               <Top5ClientsTable clients={calculatedMetricsFuncs.getTop5PayingClients(payments, clients)} />
            </Card>
         </div>

         <div className="htv gap-10 mt-1">
            <Card styles={metricCardStyle}>
               <div className="text-s bold-500 full dfb align-center wrap gap-8 mb-1">
                  <ClientStatusIndicatorFit status="beginning" />
                  <ClientStatusIndicatorFit status="working" />
               </div>
               <div className="text-xxs grey-4 full">Revenue</div>
               <div className="text-ml mt-05 full bold-700">
                  {formatNumber(calculatedMetricsFuncs.revenueFromClientStatus(payments, clients, ["beginning","working"]), {
                     prefix: '£', useCommas: true, showDecimals: true, decimalPlaces: 2
                  })}
               </div>
            </Card>
            <Card styles={metricCardStyle}>
               <div className="text-s bold-500 full dfb align-center wrap gap-8 mb-1">
                  <ClientStatusIndicatorFit status="finished" />
               </div>
               <div className="text-xxs grey-4 full">Revenue</div>
               <div className="text-ml mt-05 full bold-700">
                  {formatNumber(calculatedMetricsFuncs.revenueFromClientStatus(payments, clients, ["finished"]), {
                     prefix: '£', useCommas: true, showDecimals: true, decimalPlaces: 2
                  })}
               </div>
            </Card>
            <Card styles={metricCardStyle}>
               <div className="text-s bold-500 full dfb align-center wrap gap-8 mb-1">
                  <ClientStatusIndicatorFit status="failed" />
               </div>
               <div className="text-xxs grey-4 full">Revenue</div>
               <div className="text-ml mt-05 full bold-700">
                  {formatNumber(calculatedMetricsFuncs.revenueFromClientStatus(payments, clients, ["failed"]), {
                     prefix: '£', useCommas: true, showDecimals: true, decimalPlaces: 2
                  })}
               </div>
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
         style={{ aspectRatio: '1', borderRadius: "100%", background: "#dda200", color: "white" }}
      >
         <CircleUser size={12} />
      </div>
   </>)
}

function RevenuePerClientIcon () {
   return (<>
      <div 
         className="box fit h-fit pd-05 pdx-05 dfb align-center justify-center"
         style={{ aspectRatio: '1', borderRadius: "100%", background: "#880224", color: "white" }}
      >
         <UserRoundCheck size={12} />
      </div>
   </>)
}

function APFIcon () {
   return (<>
      <div 
         className="box fit h-fit pd-05 pdx-05 dfb align-center justify-center"
         style={{ aspectRatio: '1', borderRadius: "100%", background: "#0b54c2", color: "white" }}
      >
         <CalendarClock size={12} />
      </div>
   </>)
}