'use client'
import { useRouter } from "next/navigation";
import { CSSProperties, useEffect, useState } from "react";
import { getUniqueYears, chartGroupByMonth, chartCurrentMonth, chartLast7Days, chartTodayHourly, chartLast30Days } from "@/utils/chart";
import { getAllUserClients } from "./actions/clients";
import { getRecentPaymentsData, getAllTimePaymentsData } from "./actions/payments";
import { formatNumber } from "@/utils/num";
import { ChevronRight, CircleUserRound, PoundSterling, TrendingUp, UserStar } from "lucide-react";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Chart from "@/components/Chart/Chart";
import LoadingPageComponent from "@/components/LoadingPageComp/LoadingPageComp";
import Select from "@/components/Select/Select";
import ClientsTable from "@/components/Table/ClientsTable";
import PaymentsTable from "@/components/Table/PaymentsTable";
import Card from "@/components/Card/Card";

export default function DashboardPage () {
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
   const [chartXAxisInterval, setChartXAxisInterval] = useState<number>(0)
   
   const loadPageInfo = async () => {
      const queryAllClients = await getAllUserClients();
      const allClients: any[] = queryAllClients.success ? queryAllClients.data : [];

      const queryRecentPays = await getRecentPaymentsData();
      const recentPays: any[] = queryRecentPays.success ? queryRecentPays.data : [];
      
      const queryPaymentsData = await getAllTimePaymentsData();
      const paymentsData: any[] = queryPaymentsData.success ? queryPaymentsData.data : [];

      if (!allClients) return;
      if (!recentPays) return;
      if (!paymentsData) return;


      const clients = allClients.sort((a, b) => parseInt(b.latestupdate) - parseInt(a.latestupdate))
      setTotalAmount(paymentsData.reduce((acc, curr) => acc + parseFloat(curr.amount), 0))

      setUserClients(allClients!);
      setRecentClients([ clients[0], clients[1], clients[2] ]);
      setRecentPayments(recentPays);
      setAllPayments(paymentsData);
      setChartLabels((prev) => [ 'Today', 'Last 7 days', 'Last 30 days', 'This Month', ...getUniqueYears(paymentsData) ]);
      setChartLabelIndex(0);
      setChartData(chartTodayHourly(paymentsData!, allClients))
      setChartDataXAxis("hour")
      setChartXAxisInterval(2)
   }

   const getClientInfo = (clientId: string): Client => {
      return userClients?.filter((client) => client.clientid == clientId)[0]!
   }

   function changeOnIndex (index: number) {
      if (recentPayments == null) return;
      if (userClients == null) return;
      if (recentClients == null) return;
      if (allPayments == null) return;
      if (chartLabelIndex == null) return;
      if (chartData == null) return;
      if (getUniqueYears(allPayments!).includes(chartLabels[index!])) {
         setChartData(chartGroupByMonth(allPayments!, userClients, parseInt(chartLabels[index!])))
         setChartDataXAxis("month")
         setChartXAxisInterval(1)
      } else if (chartLabels[index!] == "This Month") {
         setChartData(chartCurrentMonth(allPayments!, userClients))
         setChartDataXAxis("day")
         setChartXAxisInterval(5)
      } else if (chartLabels[index!] == "Today") {
         setChartData(chartTodayHourly(allPayments!, userClients))
         setChartDataXAxis("hour")
         setChartXAxisInterval(3)
      } else if (chartLabels[index!] == "Last 30 days") {
         setChartData(chartLast30Days(allPayments!, userClients))
         setChartDataXAxis("date")
         setChartXAxisInterval(3)
      } else {
         setChartData(chartLast7Days(allPayments!, userClients))
         setChartDataXAxis("date")
         setChartXAxisInterval(1)
      }
   }

   useEffect(() => {
      loadPageInfo();
   }, [])
   
   if (recentPayments == null) return <LoadingPageComponent />;
   if (userClients == null) return <LoadingPageComponent />;
   if (recentClients == null) return <LoadingPageComponent />;
   if (allPayments == null) return <LoadingPageComponent />;
   if (chartLabelIndex == null) return <LoadingPageComponent />;
   if (chartData == null) return <LoadingPageComponent />;

   const cardStyles: CSSProperties = {
      width: "100%",
      padding: "25px", boxShadow: "0 1px 3px rgba(0,0,0,0.098)"
   }

   return (
      <AppWrapper>
         <div className="box mb-2">
            <div className="box full dfb column gap-5">
               <div className="text-xxs grey-5 full">Minweb Revenue</div>
               <div className="htv">
                  <div className="text-l full bold-600 mb-05">{
                     formatNumber(totalAmount, {
                        prefix: "£", useCommas: true, showDecimals: true, decimalPlaces: 2
                     })
                  }</div>
                  <div className="box full dfb align-center justify-end">
                     <Select
                        options={chartLabels}
                        onSelect={(_, index) => {
                           setChartLabelIndex(index!);
                           changeOnIndex(index!);
                        }}
                        style={{ width: "fit-content", boxShadow:"0 1px 3px rgba(0,0,0,0.097)" }}
                        optionStyle={{ padding:"8px 12px" }}
                     />
                  </div>
               </div>
            </div>
            <div className="box full h-fit mt-1">
               <Chart
                  data={chartData}
                  xDataKey={chartDataXAxis}
                  yDataKey="totalAmount"
                  xAxisInterval={chartXAxisInterval}
                  toolTipType="revenue"
                  desktopChartSize={{ width: 950 }}
               />
            </div>
         </div>

         <div className="htv gap-10 mb-1">
            <Card styles={cardStyles}>
               <div className="text-xxs grey-5 full mb-1">Recent Payments</div>
               <PaymentsTable userClients={userClients} payments={recentPayments} />
            </Card>
            <Card styles={cardStyles}>
               <div className="text-xxs full mb-1">Recent Clients</div>
               <ClientsTable clients={recentClients} />
            </Card>
         </div>

         <div className="htv gap-10 mb-1">
            <Card styles={{...cardStyles, cursor:"pointer", padding: "15px" }} onClick={() => router.push("/payments")}>
               <div className="box full dfb align-center gap-10">
                  <div 
                     className="box fit h-fit pd-1 pdx-1 dfb align-center justify-center"
                     style={{ aspectRatio: '1', borderRadius: "100%", background: "#028802", color: "white" }}
                  >
                     <PoundSterling size={17} />
                  </div>
                  <div className="box full dfb column">
                     <div className="box full dfb align-center gap-5">
                        <div className="text-xxs bold-600 fit">Payments</div>
                        <ChevronRight size={15} />
                     </div>
                     <div className="text-t grey-4">View all payments</div>
                  </div>
               </div>
            </Card>
            <Card styles={{...cardStyles, cursor:"pointer", padding: "15px" }} onClick={() => router.push("/clients")}>
               <div className="box full dfb align-center gap-10">
                  <div 
                     className="box fit h-fit pd-1 pdx-1 dfb align-center justify-center"
                     style={{ aspectRatio: '1', borderRadius: "100%", background: "#880224", color: "white" }}
                  >
                     <CircleUserRound size={17} />
                  </div>
                  <div className="box full dfb column">
                     <div className="box full dfb align-center gap-5">
                        <div className="text-xxs bold-600 fit">Clients</div>
                        <ChevronRight size={15} />
                     </div>
                     <div className="text-t grey-4">View all clients</div>
                  </div>
               </div>
            </Card>
         </div>

         <div className="htv gap-10">
            <Card styles={{...cardStyles, cursor:"pointer", padding: "15px" }} onClick={() => router.push("/revenue")}>
               <div className="box full dfb align-center gap-10">
                  <div 
                     className="box fit h-fit pd-1 pdx-1 dfb align-center justify-center"
                     style={{ aspectRatio: '1', borderRadius: "100%", background: "#8704a8", color: "white" }}
                  >
                     <TrendingUp size={17} />
                  </div>
                  <div className="box full dfb column">
                     <div className="box full dfb align-center gap-5">
                        <div className="text-xxs bold-600 fit">Revenue Insights</div>
                        <ChevronRight size={15} />
                     </div>
                     <div className="text-t grey-4">View revenue stats</div>
                  </div>
               </div>
            </Card>
            <Card styles={{...cardStyles, cursor:"pointer", padding: "15px" }} onClick={() => router.push("/reviews")}>
               <div className="box full dfb align-center gap-10">
                  <div 
                     className="box fit h-fit pd-1 pdx-1 dfb align-center justify-center"
                     style={{ aspectRatio: '1', borderRadius: "100%", background: "#c27400", color: "white" }}
                  >
                     <UserStar size={17} />
                  </div>
                  <div className="box full dfb column">
                     <div className="box full dfb align-center gap-5">
                        <div className="text-xxs bold-600 fit">Reviews</div>
                        <ChevronRight size={15} />
                     </div>
                     <div className="text-t grey-4">View all reviews from clients</div>
                  </div>
               </div>
            </Card>
         </div>
      </AppWrapper>
   )
}
