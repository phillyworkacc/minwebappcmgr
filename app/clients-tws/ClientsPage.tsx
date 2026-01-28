'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUniqueYearsClient } from "@/utils/chart";
import { pluralSuffixer, titleCase } from "@/lib/str";
import { CirclePlus } from "lucide-react";
import { ClientsTwsTable } from "@/components/Table/ClientsTable";
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Select from "@/components/Select/Select";

type ClientsPageProps = {
   allClients: Client[];
}

export default function ClientsPage ({ allClients }: ClientsPageProps) {
   const router = useRouter();
   const [clients, setClients] = useState<Client[]>(allClients);

   // filter states
   const [chartLabelIndex, setChartLabelIndex] = useState<number>(0)
   const [searchClients, setSearchClients] = useState('');
   const [filterClientStatus, setFilterClientStatus] = useState<ClientStatus | 'all'>('all');
   const chartLabels = [ 'All Time', 'Last 24 hours', 'Last 7 days', 'Last 30 days', ...getUniqueYearsClient(allClients) ]

   const filterUsingChartLabels = (index: number) => {
      if (getUniqueYearsClient(allClients).includes(chartLabels[index])) {
         return (allClients.filter(client => (new Date(parseInt(client.createdat))).getFullYear() == parseInt(chartLabels[index])));
      } else if (chartLabels[index] == "Last 30 days") {
         return (allClients.filter(client => (parseInt(client.createdat) >= (Date.now() - (30*24*60*60*1000)) )));
      } else if (chartLabels[index] == "Last 24 hours") {
         return (allClients.filter(client => (parseInt(client.createdat) >= (Date.now() - (24*60*60*1000)) )));
      } else if (chartLabels[index] == "All Time") {
         return (allClients);
      } else {
         return (allClients.filter(client => (parseInt(client.createdat) >= (Date.now() - (7*24*60*60*1000)) )));
      }
   }

   useEffect(() => {
      setClients(filterUsingChartLabels(chartLabelIndex!))
      filterByStatus(filterClientStatus)
   }, [chartLabelIndex])

   function filterByStatus (clientStatus: ClientStatus | 'all') {
      setFilterClientStatus(clientStatus)
      if (clientStatus == "all") {
         setClients(filterUsingChartLabels(chartLabelIndex))
      } else {
         setClients(filterUsingChartLabels(chartLabelIndex).filter(client => client.status == clientStatus))
      }
   }

   return (
      <AppWrapper>
         <Breadcrumb 
            pages={[
               { href: "/clients-tws", label: "TWS Clients" }
            ]}
         />

         <div className="box full dfb align-center">
            <div className="text-m full bold-600 mt-15">All TWS Clients</div>
            <div className="box full dfb align-center justify-end">
               <button className="xxxs outline-black tiny-shadow pd-1 pdx-15" onClick={() => router.push("/add-client-tws")}>
                  <CirclePlus size={17} /> Add TWS Client
               </button>
            </div>
         </div>
         
         <div className="htv">
            <div className="box full pd-1">
               <input 
                  type="text" 
                  className="xxs pd-11 pdx-15"
                  placeholder="Search Clients"
                  style={{ width: "100%", maxWidth: "400px" }}
                  value={searchClients}
                  onChange={(e) => setSearchClients(e.target.value)}
               />
            </div>
            <div className="box full dfb align-center justify-end gap-10">
               <Select
                  options={chartLabels}
                  onSelect={(_, index) => setChartLabelIndex(index!)}
                  style={{ width: "fit-content", borderRadius: "12px", boxShadow:"0 2px 5px rgba(0, 0, 0, 0.096)" }}
                  optionStyle={{ padding:"8px 12px" }}
               />
               <Select
                  options={["all","beginning","working","finished","failed"].map(s => titleCase(s))}
                  onSelect={option => filterByStatus(option.toLowerCase())}
                  defaultOptionIndex={0}
                  style={{ width: "fit-content", borderRadius: "12px", boxShadow:"0 2px 5px rgba(0, 0, 0, 0.096)" }}
                  optionStyle={{ padding:"8px 12px" }}
               />
            </div>
         </div>
         <div className="text-xxs grey-5 full mb-2 pd-1 pdx-1">
            {clients.filter(client => client.name.toLowerCase().includes(searchClients.toLowerCase())).length}
            {pluralSuffixer(
               ' client',
               clients.filter(client => client.name.toLowerCase().includes(searchClients.toLowerCase())).length,
               's'
            )} found
         </div>
         
         {(clients.length > 0) ? (<>
            {(clients.filter(client => client.name.toLowerCase().includes(searchClients.toLowerCase())).length > 0) ? (<>
               <ClientsTwsTable 
                  clients={
                     clients
                     .filter(client => client.name.toLowerCase().includes(searchClients.toLowerCase()))
                  }
                  onClickClient={client => router.push(`/client-tws/${client.clientid}`)}
               />
            </>) : (<>
               <div className="text-xxs full grey-5 text-center">No clients</div>
            </>)}
         </>) : (<>
            <div className="text-xxs full grey-5 text-center">No clients</div>
         </>)}
      </AppWrapper>
   )
}
