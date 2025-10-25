'use client'
import './Table.css'
import { formatMilliseconds } from '../../utils/date';
import { CustomUserIcon } from '../Icons/Icon';
import { formatNumber } from '@/utils/num';

type AllPaymentsTableProps = {
   payments: ClientPayment[];
   onClickPayment?: (payment: ClientPayment) => void;
}

export default function AllPaymentsTable ({ payments, onClickPayment }: AllPaymentsTableProps) {
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
                     <tr key={index} onClick={() => { if (onClickPayment) onClickPayment(payment); }}>
                        <td className='name'>
                           <div className="box fit dfb align-center gap-10">
                              <CustomUserIcon url={payment.client.image} size={25} round />
                              {payment.client.name}
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
