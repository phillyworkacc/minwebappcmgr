'use client'
import './Table.css'
import { CustomUserIcon } from '../Icons/Icon';
import { formatNumber } from '@/utils/num';

type Top5ClientsTableProps = {
   clients: {
      client: Client;
      totalPaid: number;
      paymentsMade: number;
   }[];
   onClickClient?: (client: Client) => void;
}

export default function Top5ClientsTable ({ clients, onClickClient }: Top5ClientsTableProps) {
   return (
      <div className="video-ideas-manage">
         <div className="table-container">
            <table className="video-idea-table">
               <thead>
                  <tr id='head-row'>
                     <th>Name</th>
                     <th style={{textAlign:"center"}}>Total Paid</th>
                     <th style={{textAlign:"center"}}>Payments Made</th>
                  </tr>
               </thead>
               <tbody>
                  {clients.map((client, index) => (
                     <tr key={index} onClick={() => { if (onClickClient) onClickClient(client.client); }}>
                        <td className='name'>
                           <div className="box fit dfb align-center gap-10">
                              <CustomUserIcon url={client.client.image} size={25} round />
                              {client.client.name}
                           </div>
                        </td>
                        <td style={{textAlign:"center",color:"#22bb2f"}}>{
                           formatNumber(client.totalPaid, {
                              prefix: "£", useCommas: true, showDecimals: true, decimalPlaces: 2
                           })
                        }</td>
                        <td style={{textAlign:"center"}}>{client.paymentsMade}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   )
}
