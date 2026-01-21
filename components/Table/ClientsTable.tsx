'use client'
import './Table.css'
import { formatMilliseconds } from '../../utils/date';
import { CustomUserIcon } from '../Icons/Icon';
import ClientStatusIndicator from '../ClientStatusIndicator/ClientStatusIndicator';

type ClientsTableProps = {
   clients: Client[];
   onClickClient?: (client: Client) => void;
}

export default function ClientsTable ({ clients, onClickClient }: ClientsTableProps) {
   return (
      <div className="video-ideas-manage">
         <div className="table-container">
            <table className="video-idea-table">
               <thead>
                  <tr id='head-row'>
                     <th>Name</th>
                     <th style={{textAlign:"center"}}>Status</th>
                     <th style={{textAlign:"center"}}>Date</th>
                  </tr>
               </thead>
               <tbody>
                  {clients.map((client, index) => (
                     <tr key={index} onClick={() => { if (onClickClient) onClickClient(client); }}>
                        <td className='name'>
                           <div className="box fit dfb align-center gap-10">
                              <CustomUserIcon url={client.image} size={25} round />
                              {client.name}
                           </div>
                        </td>
                        <td style={{textAlign:"center"}}><ClientStatusIndicator status={client.status}/></td>
                        <td style={{textAlign:"center"}}>{formatMilliseconds(parseInt(client.createdat), true, true)}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   )
}


export function ClientsTwsTable ({ clients, onClickClient }: ClientsTableProps) {
   return (
      <div className="video-ideas-manage">
         <div className="table-container">
            <table className="video-idea-table">
               <thead>
                  <tr id='head-row'>
                     <th>Name</th>
                     <th style={{textAlign:"center"}}>Business Name</th>
                     <th style={{textAlign:"center"}}>Phone</th>
                     <th style={{textAlign:"center"}}>Date</th>
                  </tr>
               </thead>
               <tbody>
                  {clients.map((client, index) => (
                     <tr key={index} onClick={() => { if (onClickClient) onClickClient(client); }}>
                        <td className='name'>
                           <div className="box fit dfb align-center gap-10">
                              <CustomUserIcon url={client.image} size={25} round />
                              {client.name}
                           </div>
                        </td>
                        <td style={{textAlign:"center"}}>{client.businessName}</td>
                        <td style={{textAlign:"center"}}>{client.phoneNumber}</td>
                        <td style={{textAlign:"center"}}>{formatMilliseconds(parseInt(client.createdat), true, true)}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   )
}