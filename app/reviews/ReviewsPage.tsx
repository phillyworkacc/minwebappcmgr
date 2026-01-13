'use client'
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb"
import Spacing from "@/components/Spacing/Spacing";
import ListView from "@/components/ListView/ListView";
import { CustomUserIcon, MinwebAppLogo } from "@/components/Icons/Icon";
import { pluralSuffixer } from "@/lib/str";
import { useRouter } from "next/navigation";
import { useModal } from "@/components/Modal/ModalContext";

type ReviewsPageProps = {
   reviews: ClientReview[];
}

export default function ReviewsPage({ reviews }: ReviewsPageProps) {
   const router = useRouter();
   const { showModal, close } = useModal();

   const showReviewModal = (review: ClientReview) => {
      showModal({
         content: <>
            <div className="box full dfb column pdx-1">
               <div className="box dfb align-center">
                  <div className="text-xxxs full grey-4 pd-05 mb-05">Customer Review</div>
                  <MinwebAppLogo size={20} />
               </div>
               <div className="box full dfb align-center gap-10">
                  <div className="box fit dfb align-center gap-10">
                     <div className="box fit h-full">
                        <CustomUserIcon size={30} url={review.client.image} round />
                     </div>
                     <div className="text-m full bold-600">{review.client.name}</div>
                  </div>
               </div>
               <div className="text-xxs full mt-1">{review.review}</div>
            </div>
            <div className="box full mt-2">
               <button className="xxxs pd-1 full outline-black tiny-shadow" onClick={close}>Close</button>
            </div>
         </>
      })
   }

   return (
      <AppWrapper>
         <Breadcrumb 
            pages={[
               { href: "/", label: "Reviews" }
            ]}
         />

         <div className="box full dfb column mt-15">
            <div className="text-m full bold-600">All Reviews</div>
            <div className="text-xxs full grey-5 pd-05">These are all the reviews that you have gotten from your clients</div>
            <div className="text-xxs full grey-5">{reviews.length} {pluralSuffixer('review', reviews.length, 's')}</div>
         </div>

         <div className="box full dfb column gap-20 mt-15">
            <ListView
               items={reviews}
               itemDisplayComponent={(review: ClientReview) => (
                  <div className="box full dfb column pd-05 pdx-1" onClick={() => showReviewModal(review)}>
                     <div className="box full dfb align-center gap-10">
                        <div className="box fit dfb align-center gap-10 cursor-pointer" onClick={() => router.push(`/client/${review.client.clientid}`)}>
                           <div className="box fit h-full">
                              <CustomUserIcon size={25} url={review.client.image} round />
                           </div>
                           <div className="text-xs full bold-600 visible-link">{review.client.name}</div>
                        </div>
                     </div>
                     <div className="text-xxs full mt-1">{review.review}</div>
                  </div>
               )}
            />
         </div>

         <Spacing size={4} />
      </AppWrapper>
   )
}
