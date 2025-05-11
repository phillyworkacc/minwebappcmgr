'use client'

import "@/styles/home.css"
import { useSession } from "next-auth/react";
import { useUser } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CustomIcon } from "@/components/Icons/Icons";
import { getAllTimePaymentsData, getRecentPaymentsData } from "@/app/Actions/Payments";
import { Lock } from "lucide-react";
import { getAllUserClients } from "@/app/Actions/Clients";
import { formatDateForMinwebAnalytic } from "@/utils/date";
import { moneyFormatting } from "@/utils/funcs";
import Navbar from "@/components/Navbar/Navbar";
import LoadingPaymentsPage from "./LoadingPayments";
import Card from "@/components/Card/Card";

export default function PaymentsPage() {
   const { data: session, status } = useSession();
   const { user } = useUser();
   const router = useRouter();
   const [allPayments, setAllPayments] = useState<Payment[] | null>(null)
   const [recentPayments, setRecentPayments] = useState<Payment[] | null>(null)
   const [allClients, setAllClients] = useState<Client[] | null>(null)
   const [totalAmount, setTotalAmount] = useState(0)

   const loadAllPaymentDataRequired = async () => {
      const paymentsData = await getAllTimePaymentsData();
      const recentPaymentsData = await getRecentPaymentsData();
      const allClients = await getAllUserClients();

      if (!paymentsData) return;
      if (!allClients) return;
      if (!recentPaymentsData) return;
      
      setTotalAmount(paymentsData.reduce((acc, curr) => acc + parseFloat(curr.amount), 0))
      
      setAllClients(allClients);
      setAllPayments(paymentsData);
      setRecentPayments(recentPaymentsData);
   }

   const getClientInfo = (clientId: string): Client => {
      return allClients?.filter((client) => client.clientid == clientId)[0]!
   }

   useEffect(() => {
      loadAllPaymentDataRequired();
   }, [])

   if (status == "loading") return <LoadingPaymentsPage />;
   if (!session?.user) return <LoadingPaymentsPage />;
   if (!user) return <LoadingPaymentsPage />;
   if (allPayments == null) return <LoadingPaymentsPage />;
   if (recentPayments == null) return <LoadingPaymentsPage />;

   return (<div className={`home-page ${user.color_theme}`}>
      <Navbar page="payments" />
      <div className="app-content">
         <br />
         <div className="text-c-xxl bold-700 pd-1">Payments</div>
         <div className="text-c-xl pd-0-5">£ {moneyFormatting(totalAmount)}</div>
         <div className="text-c-xxs grey dfb gap-5 pd-0-5"><Lock size={17} /> All payments received in May</div>
         <div className="text-c-s pd-1-5">
            <button className="full max" onClick={() => router.push('/add-payment-form')}>Add Payment</button>
         </div>

         <br /><br />

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

         <div className="text-c-xxs grey pd-2">
            <button className="outline-black" onClick={() => router.push('/payments/showall')}>Show all ({allPayments.length} results)</button>
         </div>
      </div>
   </div>)
}