'use client'

import "@/styles/form.css"
import { appLogo, failureImage, successImage } from "@/utils/constants"
import { getAllUserClients } from "@/app/Actions/Clients";
import { Circle, CircleCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react"
import ClientSkeleton from "@/components/ClientSkeleton/ClientSkeleton";
import { toast } from "sonner";
import { wait } from "@/utils/wait";
import { addPayment } from "@/app/Actions/Payments";

export default function AddPaymentFormPage () {
   const router = useRouter();

   const [pageDisplay, setPageDisplay] = useState<"main" | "clients" | "amount" | "feedback">("main");
   
   //* client display section states
   const [allClients, setAllClients] = useState<Client[] | null>(null)
   const [clientSelected, setClientSelected] = useState<number | null>(null)
   
   //* amount display section states
   const [amount, setAmount] = useState('')
   const [description, setDescription] = useState("")
   const [buttonLoadingAmounts, setButtonLoadingAmounts] = useState(false)

   //* feedback outcome 
   const [outcome, setOutcome] = useState(false)

   const moveToClientsDisplay = async () => {
      setPageDisplay("clients")
      const allClients = await getAllUserClients();
      setAllClients(allClients ? allClients : []);
   }

   const moveToAmountDisplay = () => {
      if (clientSelected == null) {
         toast.error("Please choose a client");
         return;
      }
      setPageDisplay("amount");
   }

   const moveToFeedbackDisplay = async () => {
      setButtonLoadingAmounts(true)
      await wait(1);
      if (amount == '') {
         toast.error("Please enter an amount");
         setButtonLoadingAmounts(false)
         return;
      }
      if (description == '') {
         toast.error("Please enter a description");
         setButtonLoadingAmounts(false)
         return;
      }
      let res = await addPayment(allClients![clientSelected!].clientid, amount, description);
      setOutcome(res);
      setButtonLoadingAmounts(false);
      setPageDisplay("feedback");
   }

   return (
      <div className="form">
         <div className="form-box">
            
            {(pageDisplay == "main") ? <>
               <div className="app-logo">
                  <img src={appLogo} alt="app logo" />
               </div><br />

               <div className="text-c-l bold-600 text-center pd-1">Minweb Payment</div>
               <div className="text-c-xs grey text-center pd-1">Hello! Proceeding with this form means that you are sure you want to add a payment to your account!</div>
               <div className="text-c-xs grey text-center pd-1">Once you start you <b>cannot</b> go back</div>

               <br />

               <div className="btn-actions">
                  <button onClick={moveToClientsDisplay}>Begin Process</button>
                  <button onClick={() => router.push("/payments")} className="outline-black">Go back to Payments</button>
               </div>

            </> : (pageDisplay == "clients") ? <>
               <div className="app-logo">
                  <img src={appLogo} alt="app logo" />
               </div><br />

               <div className="text-c-l bold-600 text-center pd-1">Minweb Payment</div>
               <div className="text-c-xs grey text-center pd-1">Choose the client payment is being made from</div>
               <div className="card-selector-scroller">
                  {(allClients == null) ? <>
                     <ClientSkeleton />
                     <ClientSkeleton />
                     <ClientSkeleton />
                  </> : <>
                     {allClients.map((client, index) => {
                        return <div className={`card-option ${index == clientSelected ? 'selected' : ''}`} key={index} onClick={() => setClientSelected(index)}>
                           <div className="check">
                              {(index == clientSelected) ? <CircleCheck fill="#236cff" stroke="#fff" /> : <Circle strokeWidth={1} />}
                           </div>
                           <div className="image"><img src={client.image} alt="client image" /></div>
                           <div className="name">{client.name}</div>
                        </div>
                     })}
                  </>}
               </div>

               <br />

               <div className="btn-actions">
                  <button onClick={moveToAmountDisplay}>Choose Client</button>
               </div>

            </> : (pageDisplay == "amount") ? <>
               <div className="app-logo-collaboration">
                  <div className="container">
                     <img src={appLogo} alt="app logo" />
                     <img className='client-image' src={allClients![clientSelected!].image} alt="client image" />
                  </div>
               </div><br />

               <div className="text-c-l bold-600 text-center pd-1">Minweb Payment</div>
               <div className="text-c-xs grey text-center pd-1">Please enter the amount of this payment and a description of what this payment is for</div>
               <div className="form-content">
                  <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
               </div>
               <div className="form-content">
                  <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
               </div>

               <br />

               <div className="btn-actions">
                  <button onClick={moveToFeedbackDisplay} disabled={buttonLoadingAmounts}>
                     {buttonLoadingAmounts ? 'Loading...' : 'Continue'}
                  </button>
               </div>

            </> : <>
               <div className="app-logo-collaboration">
                  <div className="container">
                     <img src={outcome ? successImage : failureImage} alt="status image" />
                     <img className='client-image' src={allClients![clientSelected!].image} alt="client image" />
                  </div>
               </div><br />

               {(outcome) ? <>
                  <div className="text-c-l bold-600 text-center pd-1">Payment Successful</div>
                  <div className="text-c-xs grey text-center pd-1"><b>£ {parseFloat(amount).toFixed(2)}</b> has been deposited into your account from {allClients![clientSelected!].name}</div>

                  <br />

                  <div className="btn-actions">
                     <button onClick={() => router.push('/payments')}>Back to Payments</button>
                  </div>

               </> : <>
                  <div className="text-c-l bold-600 text-center pd-1">Payment Failure</div>
                  <div className="text-c-xs grey text-center pd-1">The payment of <b>£ {parseFloat(amount).toFixed(2)}</b> could not be installed into your account from {allClients![clientSelected!].name}</div>

                  <br />

                  <div className="btn-actions">
                     <button onClick={() => router.push('/payments')}>Back to Payments</button>
                  </div>

               </>}
               
            </>}
         </div>
      </div>
   )
}
