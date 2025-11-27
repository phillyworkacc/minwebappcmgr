'use client'
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Spacing from "@/components/Spacing/Spacing";
import userDefaultImage from "@/public/clientdefault.jpg";
import MultiActionDropdown from "@/components/MultiActionDropdown/MultiActionDropdown";
import AdminClientForm from "@/components/ClientForm/AdminClientForm";
import { CustomUserIcon } from "@/components/Icons/Icon";
import { Trash2 } from "lucide-react";
import { formatMilliseconds } from "@/utils/date";

type ClientFormIndividualPageProps = {
   cfSubmission: ClientFormSubmission;
}

export default function ClientFormIndividualPage ({ cfSubmission }: ClientFormIndividualPageProps) {
   function getClientForm (): ClientForm {
      return JSON.parse(cfSubmission.clientFormJson) as ClientForm;
   }

   return (
      <AppWrapper>
         <Breadcrumb
            pages={[
               { href: "/client-forms", label: "Client Forms" },
               { href: "", label: `${getClientForm().your_information.first_name} ${getClientForm().your_information.last_name}` },
            ]}
         />
         <Spacing size={1} />

         <div className="text-xl full bold-700 pd-1">{getClientForm().business_information.business_name}</div>
         <div className="box full dfb align-center">
            <div className="box fit dfb align-center justify-center gap-10">
               <CustomUserIcon url={getClientForm().your_information.profile_image || userDefaultImage.src} size={25} round />
               <div className="text-xxs fit whitespace-nowrap">
                  {getClientForm().your_information.first_name} {getClientForm().your_information.last_name}
               </div>
            </div>
            <div className="box full dfb align-center justify-end">
               <MultiActionDropdown
                  actions={[
                     { action: () => {}, label: <><Trash2 size={15} /> Delete Client Form</>, appearance: 'delete' },
                  ]}
               />
            </div>
         </div>
         <div className="text-xxs full grey-5 pd-1">Submitted on {formatMilliseconds(cfSubmission.date)}</div>

         <Spacing size={1} />

         <div className="box full">
            <AdminClientForm clientForm={JSON.parse(cfSubmission.clientFormJson)} />
         </div>

         <Spacing size={3} />
      </AppWrapper>
   )
}
