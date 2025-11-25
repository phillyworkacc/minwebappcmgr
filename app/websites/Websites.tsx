'use client'
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import ClientWebsite from "@/components/ClientWebsite/ClientWebsite";
import Spacing from "@/components/Spacing/Spacing";
import { useState } from "react";

type WebsitesPageProps = {
   clientWebsites: (Website & {
      client: Client;
   })[];
}

export default function Websites ({ clientWebsites }: WebsitesPageProps) {
   const [searchWebsites, setSearchWebsites] = useState('');

   return (
      <AppWrapper>
         <Breadcrumb 
            pages={[
               { href: "/websites", label: "Websites" }
            ]}
         />

         <div className="box full dfb align-center">
            <div className="text-m full bold-600 mt-15">Client Websites</div>
         </div>
         
         <div className="htv">
            <div className="box full pd-1">
               <input 
                  type="text" 
                  className="xxs pd-11 pdx-15"
                  placeholder="Search Websites"
                  style={{ width: "100%", maxWidth: "400px" }}
                  value={searchWebsites}
                  onChange={(e) => setSearchWebsites(e.target.value)}
               />
            </div>
            <div className="box full pd-1 dfb align-center justify-end">
               {clientWebsites.length} Total Websites
            </div>
         </div>

         <div className="box full dfb column gap-10">
            {clientWebsites
            .filter(cw => (cw.url.toLowerCase().includes(searchWebsites.toLowerCase()) || cw.client.name.toLowerCase().includes(searchWebsites.toLowerCase()) ))
            .map((cWebsite, index) => (
               <ClientWebsite key={index} clientInfo={cWebsite.client} website={cWebsite} />
            ))}
         </div>

         <Spacing size={3} />
      </AppWrapper>
   )
}
