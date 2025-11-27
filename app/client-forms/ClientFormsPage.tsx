'use client'
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import CfFormSubmission from "@/components/CfFormSubmission/CfFormSubmission";
import Select from "@/components/Select/Select";
import Spacing from "@/components/Spacing/Spacing";
import { useState } from "react";

type ClientFormsPageProps = {
   clientFormsSubmissions: ClientFormSubmission[];
}

export default function ClientFormsPage ({ clientFormsSubmissions }: ClientFormsPageProps) {
   const [searchCfSubs, setSearchCfSubs] = useState('');
   const [cfSubmissions, setCfSubmissions] = useState<ClientFormSubmission[]>(clientFormsSubmissions);

   const filterByDate = (filter: string) => {
      if (filter == "Today") {
         const startOfToday = new Date();
         startOfToday.setHours(0, 0, 0, 0);
         setCfSubmissions(clientFormsSubmissions.filter(cfSub => (cfSub.date >= startOfToday.getTime())))
      } else if (filter == "Last 7 Days") {
         const lastSevenDaysThreshold = Date.now() - (7 * 24 * 60 * 60 * 1000);
         setCfSubmissions(clientFormsSubmissions.filter(cfSub => (cfSub.date >= lastSevenDaysThreshold)))
      } else if (filter == "Last 30 Days") {
         const lastThirtyDaysThreshold = Date.now() - (30 * 24 * 60 * 60 * 1000);
         setCfSubmissions(clientFormsSubmissions.filter(cfSub => (cfSub.date >= lastThirtyDaysThreshold)))
      } else if (filter == "All Time") {
         setCfSubmissions(clientFormsSubmissions);
      }
   }

   function filterBySearch () {
      return cfSubmissions.filter(
         cfSubmission => (
            JSON.parse(cfSubmission.clientFormJson)['your_information'].first_name.toLowerCase().includes(searchCfSubs.toLowerCase()) || 
            JSON.parse(cfSubmission.clientFormJson)['your_information'].last_name.toLowerCase().includes(searchCfSubs.toLowerCase()) || 
            JSON.parse(cfSubmission.clientFormJson)['business_information'].business_name.toLowerCase().includes(searchCfSubs.toLowerCase())
         )
      )
   }

   return (
      <AppWrapper>
         <Breadcrumb 
            pages={[
               { href: "/client-forms", label: "Client Forms" }
            ]}
         />

         <div className="box full">
            <div className="text-m full bold-600 mt-15">Client Forms</div>
         </div>
         
         <div className="htv">
            <div className="box full pd-1">
               <input 
                  type="text" 
                  className="xxs pd-11 pdx-15"
                  placeholder="Search Activities"
                  style={{ width: "100%", maxWidth: "400px" }}
                  value={searchCfSubs}
                  onChange={(e) => setSearchCfSubs(e.target.value)}
               />
            </div>
            <div className="box full dfb align-center justify-end gap-10">
               <Select
                  options={['Today','Last 7 Days','Last 30 Days','All Time']}
                  onSelect={option => filterByDate(option)}
                  defaultOptionIndex={3}
                  style={{ width: "fit-content", borderRadius: "12px", boxShadow:"0 2px 5px rgba(0, 0, 0, 0.096)" }}
                  optionStyle={{ padding:"8px 12px" }}
               />
            </div>
         </div>

         <Spacing size={1} />

         {(cfSubmissions.length > 0) ? (<>
            {(filterBySearch().length > 0) ? (<>
               {filterBySearch()
                  .map((cfSubmission, index) => (
                     <CfFormSubmission key={index} cfSubmission={cfSubmission} />
                  ))
               }
               <Spacing size={3} />
            </>) : (<>
               <div className="text-xxs full grey-5 text-center">No activities</div>
            </>)}
         </>) : (<>
            <div className="text-xxs full grey-5 text-center">No activities</div>
         </>)}
      </AppWrapper>
   )
}
