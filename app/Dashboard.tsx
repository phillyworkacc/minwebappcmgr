'use client'
import { useRouter } from "next/navigation";
import { CSSProperties, useEffect, useState } from "react";
import { getUniqueYears, chartGroupByMonth, chartCurrentMonth, chartLast7Days, chartTodayHourly, chartLast30Days } from "@/utils/chart";
import { formatNumber } from "@/utils/num";
import { BookCopy, ChevronRight, CircleUserRound, Copy, Globe2, ListTodo, PoundSterling, TrendingUp, UserStar } from "lucide-react";
import { copyToClipboard } from "@/lib/str";
import { toast } from "sonner";
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Chart from "@/components/Chart/Chart";
import LoadingPageComponent from "@/components/LoadingPageComp/LoadingPageComp";
import Select from "@/components/Select/Select";
import ClientsTable from "@/components/Table/ClientsTable";
import PaymentsTable from "@/components/Table/PaymentsTable";
import Card from "@/components/Card/Card";
import ActivitiesTable from "@/components/Table/ActivitiesTable";
import Spacing from "@/components/Spacing/Spacing";
import MultiActionDropdown from "@/components/MultiActionDropdown/MultiActionDropdown";

type DashboardPageProps = {
   allClients: Client[],
   allActivities: ActivityClient[],
   allPayments: Payment[]
}

export default function DashboardPage ({ allActivities, allClients, allPayments }: DashboardPageProps) {
   const router = useRouter();
   const [recentPayments, setRecentPayments] = useState<Payment[]>(allPayments.slice(0,3))
   const [userClients, setUserClients] = useState<Client[]>(allClients)
   const [recentClients, setRecentClients] = useState<Client[]>(allClients.sort((a, b) => parseInt(b.latestupdate) - parseInt(a.latestupdate)).slice(0,3))

   const [totalAmount, setTotalAmount] = useState(0)
   const [chartLabelIndex, setChartLabelIndex] = useState<null | number>(null)
   const [chartLabels, setChartLabels] = useState([''])

   const [chartData, setChartData] = useState<null | any>(null)
   const [chartDataXAxis, setChartDataXAxis] = useState<string>("")
   const [chartXAxisInterval, setChartXAxisInterval] = useState<number>(0)
   
   const loadPageInfo = async () => {
      setTotalAmount(allPayments.reduce((acc, curr) => acc + parseFloat(curr.amount), 0));
      setChartLabels((prev) => [ 'Today', 'Last 7 days', 'Last 30 days', 'This Month', ...getUniqueYears(allPayments) ]);
      setChartLabelIndex(0);
      setChartData(chartTodayHourly(allPayments!, allClients))
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

         {(allActivities.length > 0) && (<div className="htv gap-10 mb-1">
            <Card styles={cardStyles}>
               <div className="box full dfb align-center mb-1">
                  <div className="text-xxs grey-5 full">Activities</div>
                  <div className="box full dfb align-center justify-end">
                     <div className="text-xxs visible-link fit accent-color" onClick={() => router.push("/activities")}>See all</div>
                  </div>
               </div>
               <ActivitiesTable activities={allActivities} onClickActivity={activity => router.push(`/activity/${activity.activityId}`)} />
            </Card>
         </div>)}

         <div className="htv gap-10 mb-1">
            <Card styles={cardStyles}>
               <div className="box full dfb align-center mb-1">
                  <div className="text-xxs grey-5 full">Recent Payments</div>
                  <div className="box full dfb align-center justify-end">
                     <div className="text-xxs visible-link fit accent-color" onClick={() => router.push("/payments")}>See all</div>
                  </div>
               </div>
               <PaymentsTable userClients={allClients} payments={recentPayments} />
            </Card>
            <Card styles={cardStyles}>
               <div className="box full dfb align-center mb-1">
                  <div className="text-xxs grey-5 full">Recent Clients</div>
                  <div className="box full dfb align-center justify-end gap-20">
                     <div className="text-xxs visible-link fit accent-color" onClick={() => router.push("/clients")}>See all</div>
                     <div className="box fit">
                        <MultiActionDropdown actions={[{
                           label: <><Copy size={15} /> Copy Onboarding Link</>,
                           action: () => {
                              copyToClipboard(`https://app.minwebagency.com/onboarding`);
                              toast.success("Copied");
                           },
                           appearance: "normal"
                        }]} />
                     </div>
                  </div>
               </div>
               <ClientsTable clients={recentClients} />
            </Card>
         </div>
         <Spacing size={4} />
      </AppWrapper>
   )
}
