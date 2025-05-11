'use client'

import "@/styles/home.css"
import { useSession } from 'next-auth/react'
import { useUser } from "./context/UserContext";
import { useEffect, useState } from "react";
import { getAllUserClients } from "./Actions/Clients";
import { CustomIcon } from "@/components/Icons/Icons";
import { formatDateForMinwebAnalytic } from "@/utils/date";
import { moneyFormatting } from "@/utils/funcs";
import { getAllTimePaymentsData, getRecentPaymentsData } from "./Actions/Payments";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import AppLogoUserWelcome from "@/components/AppLogoUserWelcome/AppLogoUserWelcome";
import Chart from "@/components/Chart/Chart";
import LoadingHomePage from "./LoadingHomePage";
import Card from "@/components/Card/Card";
import Client from "@/components/Client/Client";
import { chartCurrentMonth, chartGroupByMonth, chartLast7Days, getUniqueYears } from "@/utils/chartFuncs";

export default function HomePage() {
   const { data: session, status } = useSession();
   const { user } = useUser();
   const router = useRouter();
   const [recentPayments, setRecentPayments] = useState<Payment[] | null>(null)
   const [allPayments, setAllPayments] = useState<Payment[] | null>(null)

   const [userClients, setUserClients] = useState<Client[] | null>(null)
   const [recentClients, setRecentClients] = useState<Client[] | null>(null)

   const [totalAmount, setTotalAmount] = useState(0)
   const [chartLabelIndex, setChartLabelIndex] = useState<null | number>(null)
   const [chartLabels, setChartLabels] = useState([''])

   const [chartData, setChartData] = useState<null | any>(null)
   const [chartDataXAxis, setChartDataXAxis] = useState<string>("")

   const loadPageInfo = async () => {
      const allClients: Client[] = await getAllUserClients();
      const recentPays = await getRecentPaymentsData();
      const paymentsData = await getAllTimePaymentsData();

      if (!allClients) return;
      if (!recentPays) return;
      if (!paymentsData) return;

      const clients = allClients.sort((a, b) => parseInt(b.latestupdate) - parseInt(a.latestupdate))
      setTotalAmount(paymentsData.reduce((acc, curr) => acc + parseFloat(curr.amount), 0))

      setUserClients(allClients);
      setRecentClients([ clients[0], clients[1], clients[2] ]);
      setRecentPayments(recentPays);
      setAllPayments(paymentsData);
      setChartLabels((prev) => [ ...getUniqueYears(paymentsData), 'This Month', 'Last 7 days' ]);
      setChartLabelIndex(0);
      setChartData(chartGroupByMonth(paymentsData, parseInt(getUniqueYears(paymentsData)[0])))
      setChartDataXAxis("month")
   }

   const getClientInfo = (clientId: string): Client => {
      return userClients?.filter((client) => client.clientid == clientId)[0]!
   }

   useEffect(() => {
      if (recentPayments == null) return;
      if (userClients == null) return;
      if (recentClients == null) return;
      if (allPayments == null) return;
      if (chartLabelIndex == null) return;
      if (chartData == null) return;
      if (getUniqueYears(allPayments!).includes(chartLabels[chartLabelIndex!])) {
         setChartData(chartGroupByMonth(allPayments!, parseInt(getUniqueYears(allPayments!)[chartLabelIndex!])))
         setChartDataXAxis("month")
      } else if (chartLabels[chartLabelIndex!] == "This Month") {
         setChartData(chartCurrentMonth(allPayments!))
         setChartDataXAxis("day")
      } else {
         setChartData(chartLast7Days(allPayments!))
         setChartDataXAxis("date")
      }
   }, [chartLabelIndex])

   useEffect(() => {
      loadPageInfo();
   }, [])

   if (status == "loading") return <LoadingHomePage />;
   if (!session?.user) return <LoadingHomePage />;
   if (!user) return <LoadingHomePage />;
   if (recentPayments == null) return <LoadingHomePage />;
   if (userClients == null) return <LoadingHomePage />;
   if (recentClients == null) return <LoadingHomePage />;
   if (allPayments == null) return <LoadingHomePage />;
   if (chartLabelIndex == null) return <LoadingHomePage />;
   if (chartData == null) return <LoadingHomePage />;

   return (<div className={`home-page ${user.color_theme}`}>
      <Navbar page="home" />
      <div className="app-content">
         <AppLogoUserWelcome name={user.name} />
         <br />
         <div className="text-c-xl pd-1">£ {moneyFormatting(totalAmount)}</div>
         <div className="options text-c-xxxs dfb gap-5 flex-wrap full-width pd-1-5">
            {chartLabels.map((chartLabel, index) => {
               return <div 
                  key={index} 
                  className={`div-selector-option ${index == chartLabelIndex ? 'selected' : ''}`}
                  onClick={() => setChartLabelIndex(index)}
               >{chartLabel}</div>
            })}
         </div>
         <div className="text-c-s pd-1">
            <Chart data={chartData} userColorTheme={user.color_theme} yDataKey="totalAmount" xDataKey={chartDataXAxis} />
         </div>

         <br />
         
         <div className="text-c-l bold-500 pd-1">Recent Clients</div>
         <div className="client-list">
            {recentClients.map((userClient, index) => {
               return <Client key={index} client={userClient} />
            })}
         </div>
         <button className="outline-black" onClick={() => router.push('/clients')}>See all clients</button>

         <br /><br /><br />
         
         <div className="text-c-l bold-500 pd-1">Recent Payments</div>
         <div className="text-c-s full dfbc left-align gap-13 pd-1">
            {recentPayments.map((recPayment, index) => {
               const client = getClientInfo(recPayment.clientid);
               let formattedAmount = moneyFormatting(parseFloat(recPayment.amount))
               return <Card key={index}>
                  <div className="text-c-xs dfb gap-7 pd-1">
                     <CustomIcon url={client.image} size={25} /> <b>£{formattedAmount}</b> {client.name}
                  </div>
                  <div className="text-c-xxs grey">{recPayment.text}</div>
                  <div className="text-c-xxs grey pd-1">You received a payment of £ {formattedAmount} from {client.name} {formatDateForMinwebAnalytic(parseInt(recPayment.date))}</div>
               </Card>
            })}
         </div>
         <button className="outline-black" onClick={() => router.push('/payments')}>See all payments</button>

      </div>
   </div>)
}
