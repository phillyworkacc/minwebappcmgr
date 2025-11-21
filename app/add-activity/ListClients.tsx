'use client'
import ClientsTable from "@/components/Table/ClientsTable";
import { useState } from "react";

export default function ListClients ({ allClients, chooseClient }: { allClients: Client[], chooseClient: (client: Client) => void; }) {
   const [clients, setClients] = useState<Client[]>(allClients);
   const [searchClients, setSearchClients] = useState('');
   
   return (<>
      <div className="htv mb-1">
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
      </div>
      
      {(clients.length > 0) ? (<>
         {(clients.filter(client => client.name.toLowerCase().includes(searchClients.toLowerCase())).length > 0) ? (<>
            <ClientsTable 
               clients={
                  clients
                  .filter(client => client.name.toLowerCase().includes(searchClients.toLowerCase()))
               }
               onClickClient={client => chooseClient(client)}
            />
         </>) : (<>
            <div className="text-xxs full grey-5 text-center">No clients</div>
         </>)}
      </>) : (<>
         <div className="text-xxs full grey-5 text-center">No clients</div>
      </>)}
   </>)
}
