'use client'

import '@/styles/form.css'
import { sendReviewForClient } from '@/app/Actions/Clients'
import { appLogo } from "@/utils/constants"
import { wait } from '@/utils/wait'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ClientReview({ client }: { client: Client }) {
   const [review, setReview] = useState("")
   const [pageDisplay, setPageDisplay] = useState<"main" | "success">("main")
   const [buttonLoading, setButtonLoading] = useState(false)
   const router = useRouter();

   const onSubmitReview = async () => {
      setButtonLoading(true)
      await wait(0.2);
      if (review == "") {
         setButtonLoading(false)
         return;
      }
      const res = await sendReviewForClient(client.clientid, review);
      if (res) setPageDisplay("success");
      setReview("");
      setButtonLoading(false)
   }

   return (
      <div className="form">
         <div className="form-box">
            <div className="app-logo-collaboration">
               <div className="container">
                  <img src={appLogo} alt="app logo" />
                  <img className='client-image' src={client.image} alt="client image" />
               </div>
            </div><br />
            
            {(pageDisplay == "main") ? <>
               <div className="text-c-xxs text-center grey">{client.name}</div>
               <div className="text-c-l bold-600 text-center pd-1">Write your review</div>
               <div className="text-c-xs grey text-center pd-1">Hi! It's been a pleasure working with you. Looking forward to working together again in the future!</div>

               <div className="form-content">
                  <textarea placeholder="Review" value={review} onChange={(e) => setReview(e.target.value)} />
               </div>

               <div className="form-content">
                  <button disabled={buttonLoading} onClick={onSubmitReview}>
                     {buttonLoading ? 'Loading...' : 'Submit'}
                  </button>
               </div>
            </> : <>
               <div className="text-c-l bold-600 text-center pd-1">Review Sent</div>
               <div className="text-c-xs grey text-center pd-1">Your feedback has been submitted successfully — we really appreciate your time and support.</div>
               <div className="form-content">
                  <button onClick={() => router.push('https://minweb.freevar.com')}>Visit our website</button>
                  <button className='outline-black' onClick={() => setPageDisplay("main")}>Write another review</button>
               </div>
            </>}
         </div>
      </div>
   )
}
