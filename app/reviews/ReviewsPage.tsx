'use client'
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb"
import Spacing from "@/components/Spacing/Spacing";
import { CustomUserIcon } from "@/components/Icons/Icon";
import { pluralSuffixer } from "@/lib/str";
import { useRouter } from "next/navigation";

type ReviewsPageProps = {
   reviews: ClientReview[];
}

export default function ReviewsPage({ reviews }: ReviewsPageProps) {
   const router = useRouter();

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
            {reviews.map((review, index) => (
               <div key={index} className="box full dfb align-center gap-10 h-fit pd-1">
                  <div className="box full dfb column">
                     <div className="box full dfb align-center gap-10">
                        <div className="box fit dfb align-center gap-10 cursor-pointer" onClick={() => router.push(`/client/${review.client.clientid}`)}>
                           <div className="box fit h-full">
                              <CustomUserIcon size={30} url={review.client.image} round />
                           </div>
                           <div className="text-s full"><b>{review.client.name}</b> left a review</div>
                        </div>
                     </div>
                     <div className="text-xxs full mt-05">{review.review}</div>
                  </div>
               </div>
            ))}
         </div>

         <Spacing size={4} />
      </AppWrapper>
   )
}
