'use client'
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import ListClients from "./ListClients"
import AwaitButton from "@/components/AwaitButton/AwaitButton"
import { useState } from "react"
import { CustomUserIcon, MinwebAppLogo } from "@/components/Icons/Icon"
import { ArrowLeft, CreditCard } from "lucide-react"
import { addPayment } from "../actions/payments"
import { formatNumber } from "@/utils/num"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb"

type FormType = 'choose-client' | 'amount' | 'success' | 'fail'
type AddPaymentPageProps = {
   allClients: Client[];
}

export default function AddPaymentPage ({ allClients }: AddPaymentPageProps) {
   const router = useRouter();
   const [formStep, setFormStep] = useState<FormType>('choose-client');

   const [chosenClient, setChosenClient] = useState<Client | null>(null);
   const [amount, setAmount] = useState('');
   const [description, setDescription] = useState('');

   const makePaymentBtn = async (callback: Function) => {
      if (!chosenClient) return;
      if (amount == '') {
         toast.error("Please enter an amount");
         callback();
         return;
      }
      const paid = await addPayment(chosenClient.clientid, amount, description);
      setFormStep(paid.success ? "success" : "fail");
      callback();
   }

   return (
      <AppWrapper>
         <Breadcrumb 
            pages={[
               { href: "/payments", label: "Payments" },
               { href: "", label: "Add Payment" }
            ]}
         />
      
         {(formStep == "choose-client") && (<>
            <div className="box pd-1 full">
               <div className="text-xxxs grey-4 full">Minweb Payment</div>
               <div className="text-xl full bold-600">Choose Client</div>
               <div className="text-xxs full">Select the client payment is being made from</div>
            </div>
            <ListClients
               allClients={allClients}
               chooseClient={client => {
                  setChosenClient(client);
                  setFormStep("amount");
               }}
            />
         </>)}

         {(formStep == "amount") && (<>
            <div className="box pd-1 full mb-1">
               <div className="box full dfb align-center gap-10">
                  <div className="text-xs grey-4 fit">Minweb Payment</div>
                  <div className="box dfb align-center fit">
                     <MinwebAppLogo size={30} />
                     <CustomUserIcon url={chosenClient?.image!} size={30} round />
                  </div>
               </div>
               <div className="text-xl full bold-600">{chosenClient?.name}'s Payment</div>
               <div className="text-xxs full">Please enter the amount of this payment and a description of what this payment is for</div>
            </div>
            <div className="box full">
               <div className="box full pd-1">
                  <input 
                     type="number" 
                     className="xxs pd-12 pdx-15 full" 
                     placeholder="Amount"
                     onChange={e => setAmount(e.target.value)}
                     value={amount}
                  />
               </div>
               <div className="box full pd-1">
                  <textarea 
                     id="description" 
                     name="description" 
                     className="xxs pd-12 pdx-15 full h-30" 
                     placeholder="Description"
                     style={{borderRadius:"12px"}}
                     onChange={e => setDescription(e.target.value)}
                     value={description}
                  />
               </div>
               <div className="box full pd-1">
                  <AwaitButton className="xxs pd-12 pdx-2" onClick={makePaymentBtn}>
                     <CreditCard size={17} /> Make Payment
                  </AwaitButton>
               </div>
            </div>
         </>)}
         
         {(formStep == "success") && (<>
            <div className="box pd-1 full mb-1">
               <div className="box full dfb align-center gap-10">
                  <div className="text-xs grey-4 fit">Minweb Payment</div>
                  <CustomUserIcon url={'/success.png'} size={30} round />
               </div>
               <div className="text-xl full bold-600">Payment Successful</div>
               <div className="text-xxs full">
                  <b>{formatNumber(parseFloat(amount), {
                     prefix: '£', useCommas: true, showDecimals: true, decimalPlaces: 2
                  })}</b> has been deposited into your account from {chosenClient?.name!}
               </div>
            </div>
            <div className="box pd-1 full">
               <button className="xxs pd-12 pdx-2" onClick={() => router.push('/payments')}>
                  <ArrowLeft size={17} /> Back to Payments
               </button>
            </div>
         </>)}

         {(formStep == "fail") && (<>
            <div className="box pd-1 full mb-1">
               <div className="box full dfb align-center gap-10">
                  <div className="text-xs grey-4 fit">Minweb Payment</div>
                  <CustomUserIcon url={'/fail.png'} size={30} round />
               </div>
               <div className="text-xl full bold-600">Payment Failed</div>
               <div className="text-xxs full">The payment of 
                  <b>{formatNumber(parseFloat(amount), {
                     prefix: ' £', useCommas: true, showDecimals: true, decimalPlaces: 2
                  })}</b> could not be installed into your account from {chosenClient?.name!}
               </div>
            </div>
            <div className="box pd-1 full">
               <button className="xxs pd-1 pdx-2" onClick={() => router.push('/payments')}>
                  <ArrowLeft size={17} /> Back to Payments
               </button>
            </div>
         </>)}

      </AppWrapper>
   )
}
