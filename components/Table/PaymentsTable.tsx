'use client'
import './Table.css'
import { formatMilliseconds } from '../../utils/date';
import { CustomUserIcon } from '../Icons/Icon';
import { formatNumber } from '@/utils/num';

export default function PaymentsTable ({ payments, userClients }: { payments: Payment[], userClients: Client[] }) {
   const getClientInfo = (clientId: string): Client => {
      return userClients?.find((client) => client.clientid == clientId)!;
   }

   return (
      <div className="video-ideas-manage">
         <div className="table-container">
            <table className="video-idea-table">
               <thead>
                  <tr id='head-row'>
                     <th>Name</th>
                     <th style={{textAlign:"center"}}>Amount</th>
                     <th style={{textAlign:"center"}}>Paid On</th>
                  </tr>
               </thead>
               <tbody>
                  {payments.map((payment, index) => (
                     <tr key={index}>
                        <td className='name'>
                           <div className="box fit dfb align-center gap-10">
                              <CustomUserIcon url={getClientInfo(payment.clientid).image} size={25} round />
                              {getClientInfo(payment.clientid).name}
                           </div>
                        </td>
                        <td style={{textAlign:"center",color:"#22bb2f"}}>{
                           formatNumber(parseFloat(payment.amount), {
                              prefix: "£", useCommas: true, showDecimals: true, decimalPlaces: 2
                           })
                        }</td>
                        <td style={{textAlign:"center"}}>{formatMilliseconds(parseInt(payment.date), true, true)}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   )
}
