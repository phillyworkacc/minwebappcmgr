'use client'
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import AllPaymentsTable from "@/components/Table/AllPaymentsTable";
import Select from "@/components/Select/Select";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import { useEffect, useState } from "react";
import { getUniqueYears } from "@/utils/chart";
import { useModal } from "@/components/Modal/ModalContext";
import { formatNumber } from "@/utils/num";
import { formatMilliseconds } from "@/utils/date";
import { pluralSuffixer } from "@/lib/str";
import { CirclePlus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deletePayment } from "../actions/payments";

type PaymentsPageProps = {
   allPayments: ClientPayment[];
}

export default function PaymentsPage ({ allPayments }: PaymentsPageProps) {
   const router = useRouter();
   const { showModal, close } = useModal();
   const [allClientPayments, setAllClientPayments] = useState<ClientPayment[]>(allPayments);

   // filter states
   const [chartLabelIndex, setChartLabelIndex] = useState<number>(0)
   const [searchPayees, setSearchPayees] = useState('');
   const chartLabels = [ 'All Time', 'Last 24 hours', 'Last 7 days', 'Last 30 days', ...getUniqueYears(allPayments) ];

   const openPaymentInfo = (payment: ClientPayment) => {
      const deletePaymentBtn = async (callback: Function) => {
         const deleted = await deletePayment(payment.client.clientid, payment.date, payment.amount);
         if (deleted) {
            toast.success("Deleted Payment");
            router.refresh();
         } else {
            toast.error("Failed to delete payment");
         }
         close();
         callback();
      }

      showModal({
         content: <div className="box full h-fit" style={{userSelect:"none"}}>
            <div className="text-s bold-500 text-center full">{payment.client.name}'s Payment Info</div>
            <div className="box full dfb column gap-10 mt-2">
               <div className="box full dfb column">
                  <div className="text-xl bold-700 text-center">{
                     formatNumber(parseFloat(payment.amount), {
                        prefix: "£", useCommas: true, showDecimals: true, decimalPlaces: 2
                     })
                  }</div>
                  <div className="text-xxs full text-center grey-5 pd-05">
                     Paid on {formatMilliseconds(parseInt(payment.date), true)}
                  </div>
               </div>
               <div className="text-xxs full text-center mb-1">{payment.text}</div>
               <div className="htv gap-10 mt-1">
                  <button className="xxs full outline-black tiny-shadow pd-13" onClick={()=>close()}>Cancel</button>
                  <AwaitButton className="xxs full delete tiny-shadow pd-13" onClick={deletePaymentBtn}>
                     <Trash2 size={17} /> Delete Payment
                  </AwaitButton>
               </div>
            </div>
         </div>
      })   
   }

   useEffect(() => {
      if (getUniqueYears(allPayments).includes(chartLabels[chartLabelIndex])) {
         setAllClientPayments(allPayments.filter(client => (new Date(parseInt(client.date))).getFullYear() == parseInt(chartLabels[chartLabelIndex])));
      } else if (chartLabels[chartLabelIndex!] == "Last 30 days") {
         setAllClientPayments(allPayments.filter(clientPayment => (parseInt(clientPayment.date) >= (Date.now() - (30*24*60*60*1000)) )));
      } else if (chartLabels[chartLabelIndex!] == "Last 24 hours") {
         setAllClientPayments(allPayments.filter(clientPayment => (parseInt(clientPayment.date) >= (Date.now() - (24*60*60*1000)) )));
      } else if (chartLabels[chartLabelIndex!] == "All Time") {
         setAllClientPayments(allPayments);
      } else {
         setAllClientPayments(allPayments.filter(clientPayment => (parseInt(clientPayment.date) >= (Date.now() - (7*24*60*60*1000)) )));
      }
   }, [chartLabelIndex])

   return (
      <AppWrapper>
         <Breadcrumb 
            pages={[
               { href: "/payments", label: "Payments" }
            ]}
         />

         <div className="box full dfb align-center">
            <div className="text-m full bold-600 mt-15">All Payments</div>
            <div className="box full dfb align-center justify-end">
               <button className="xxxs outline-black tiny-shadow pd-1 pdx-15" onClick={() => router.push("/add-payment")}>
                  <CirclePlus size={17} /> Add Payment
               </button>
            </div>
         </div>
         
         <div className="htv">
            <div className="box full pd-1">
               <input 
                  type="text" 
                  className="xxs pd-11 pdx-15"
                  placeholder="Search Payments"
                  style={{ width: "100%", maxWidth: "400px" }}
                  value={searchPayees}
                  onChange={(e) => setSearchPayees(e.target.value)}
               />
            </div>
            <div className="box full dfb align-center justify-end">
               <Select
                  options={chartLabels}
                  onSelect={(_, index) => setChartLabelIndex(index!)}
                  style={{ width: "fit-content", borderRadius: "12px", boxShadow:"0 2px 5px rgba(0, 0, 0, 0.096)" }}
                  optionStyle={{ padding:"8px 12px" }}
               />
            </div>
         </div>
         <div className="text-xxs grey-5 full mb-2 pdx-1">
            {allClientPayments.filter(clientPayment => clientPayment.client.name.toLowerCase().includes(searchPayees.toLowerCase())).length}
            {pluralSuffixer(
               ' payment',
               allClientPayments.filter(clientPayment => clientPayment.client.name.toLowerCase().includes(searchPayees.toLowerCase())).length,
               's'
            )} found
         </div>
         
         {(allClientPayments.length > 0) ? (<>
            {(allClientPayments.filter(clientPayment => clientPayment.client.name.toLowerCase().includes(searchPayees.toLowerCase())).length > 0) ? (<>
               <AllPaymentsTable 
                  payments={
                     allClientPayments
                     .filter(clientPayment => clientPayment.client.name.toLowerCase().includes(searchPayees.toLowerCase()))
                  }
                  onClickPayment={payment => openPaymentInfo(payment)}
               />
            </>) : (<>
               <div className="text-xxs full grey-5 text-center">No results</div>
            </>)}
         </>) : (<>
            <div className="text-xxs full grey-5 text-center">No results</div>
         </>)}
      </AppWrapper>
   )
}
