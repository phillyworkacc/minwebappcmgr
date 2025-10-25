'use client'
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import { sendReviewForClient } from "@/app/actions/clients";
import { CustomUserIcon } from "@/components/Icons/Icon";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type ReviewPageProps = {
   client: Client;
}

export default function ReviewPage({ client }: ReviewPageProps) {
   const router = useRouter();
   const [review, setReview] = useState("");
   const [pageDisplay, setPageDisplay] = useState<"main" | "success" | "fail">("main");

   const onSubmitReview = async (callback: Function) => {
      if (review == "") {
         toast.error("Please enter a review");
         callback();
         return;
      }
      const res = await sendReviewForClient(client.clientid, review);
      if (res) {
         setPageDisplay("success");
         setReview("");
      } else {
         setPageDisplay("fail")
      }
      callback();
   }

   return (
      <div className="app">
         <div className="content">
            <div className="content-wrapper">
               <div className='box full h-full dfb column align-center justify-center'>
                  <div className="box full mb-05 dfb align-center justify-center">
                     <CustomUserIcon url={client.image} size={60} round />
                  </div>

                  {(pageDisplay == "main") && (<>
                     <div className="text-sm grey-5 full text-center">{client.name}</div>
                     <div className="text-l bold-600 full text-center">Write your review</div>
                     <div className="text-xs grey-5 full text-center pd-05 mb-15">Hi! It's been a pleasure working with you. Looking forward to working together again in the future!</div>

                     <div className="box full pd-1">
                        <textarea 
                           id="description" 
                           name="description" 
                           className="xs pd-2 pdx-2 full h-35" 
                           placeholder="Review" 
                           style={{borderRadius:"12px"}}
                           value={review} 
                           onChange={(e) => setReview(e.target.value)}
                        />
                     </div>

                     <div className="box full pd-1">
                        <AwaitButton className="xxs full pd-12" onClick={onSubmitReview}>
                           Submit Review
                        </AwaitButton>
                     </div>
                  </>)}

                  {(pageDisplay == "success") && (<>
                     <div className="text-l bold-600 full text-center">Review Sent</div>
                     <div className="text-xs grey-5 text-center pd-1">Your feedback has been submitted successfully — we really appreciate your time and support.</div>
                     <div className="box full dfb column gap-10">
                        <button className="xxs pd-12 full" onClick={() => router.push('https://minweb.freevar.com')}>Visit our website</button>
                        <button className='xxs pd-12 full outline-black tiny-shadow' onClick={() => setPageDisplay("main")}>Write another review</button>
                     </div>
                  </>)}

                  {(pageDisplay == "fail") && (<>
                     <div className="text-l bold-600 full text-center">Failed to Send Review</div>
                     <div className="box full dfb column gap-10 mt-1">
                        <button className='xxs pd-12 full outline-black tiny-shadow' onClick={() => setPageDisplay("main")}>Try Again</button>
                     </div>
                  </>)}

               </div>
            </div>
         </div>
      </div>
   )
}
