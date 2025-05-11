'use client'

import "@/styles/home.css"
import { useSession } from 'next-auth/react'
import { useUser } from "@/app/context/UserContext";
import { useEffect, useState } from "react";
import { CustomIcon } from "@/components/Icons/Icons";
import { useRouter } from "next/navigation";
import { getAllTimePaymentsData } from "@/app/Actions/Payments";
import { getAllUserClients } from "@/app/Actions/Clients";
import { formatDateForMinwebAnalytic } from "@/utils/date";
import { moneyFormatting } from "@/utils/funcs";
import Navbar from "@/components/Navbar/Navbar";
import Card from "@/components/Card/Card";
import BackTick from "@/components/BackTick/BackTick";
import LoadingShowAllPaymentsPage from "./LoadingShowAllPayments";

export default function ShowAllPaymentsPage() {
   const { data: session, status } = useSession();
   const { user } = useUser();
   const [allPaymentsData, setAllPaymentsData] = useState<Payment[] | null>(null);
   const [allClients, setAllClients] = useState<Client[] | null>(null)
   const router = useRouter();

   const loadAllTimeTrackingData = async () => {
      const paymentsData = await getAllTimePaymentsData();
      const allClients = await getAllUserClients();
      if (!paymentsData) return;
      if (!allClients) return;
      setAllClients(allClients);
      setAllPaymentsData(paymentsData);
   }

   const getClientInfo = (clientId: string): Client => {
      return allClients?.filter((client) => client.clientid == clientId)[0]!
   }

   useEffect(() => {
      loadAllTimeTrackingData();
   }, [])

   if (status == "loading") return <LoadingShowAllPaymentsPage />;
   if (!session?.user) return <LoadingShowAllPaymentsPage />;
   if (!user) return <LoadingShowAllPaymentsPage />;
   if (allPaymentsData == null) return <LoadingShowAllPaymentsPage />;

   return (<div className={`home-page ${user.color_theme}`}>
      <Navbar />
      <div className="app-content">

         <BackTick action={() => router.push('/payments')}>Back to Payments</BackTick>
         <div className="text-c-xxl bold-700 pd-2">All Payments</div>
         <div className="text-c-s full dfbc left-align gap-10 pd-1">
            {allPaymentsData.map((recPayment, index) => {
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

      </div>
   </div>)
}
