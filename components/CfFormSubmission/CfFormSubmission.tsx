'use client'
import "./CfFormSubmission.css"
import Card from "../Card/Card";
import { useRouter } from "next/navigation";
import { CustomUserIcon } from "../Icons/Icon";
import { formatMilliseconds } from "@/utils/date";
import userDefaultImage from "@/public/clientdefault.jpg"

export default function CfFormSubmission ({ cfSubmission }: { cfSubmission: ClientFormSubmission }) {
   const router = useRouter();

   function getClientForm (): ClientForm {
      return JSON.parse(cfSubmission.clientFormJson) as ClientForm;
   }

   return (
      <div className="box full mb-1">
         <Card 
            className="cf-submission-view-card" 
            styles={{ padding: "20px", cursor: "pointer", boxShadow: "none" }} 
            cursor onClick={() => router.push(`/client-form/${cfSubmission.clientFormId}`)}
         >
            <div className="text-sm full bold-600">{getClientForm().business_information.business_name}</div>
            <div className="box fit dfb align-center justify-center gap-10 pd-1">
               <CustomUserIcon url={getClientForm().your_information.profile_image || userDefaultImage.src} size={25} round />
               <div className="text-xxs fit">
                  {getClientForm().your_information.first_name} {getClientForm().your_information.last_name}
               </div>
            </div>
            <div className="text-xxs full grey-5 mb-05">Submitted on {formatMilliseconds(cfSubmission.date, true)}</div>        
         </Card>
      </div>
   )
}
