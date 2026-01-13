'use client'
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import { useState } from "react";
import { sendSMSMessage } from "../actions/twilio-sms";
import { toast } from "sonner";

export default function PhoneNumbersPage () {
   const [phoneNumber, setPhoneNumber] = useState('');
   const [message, setMessage] = useState('');

   const sendSmsAction = async (callback: Function) => {
      if (message == "" || phoneNumber == "") {
         toast.error("Please fill all the empty fields")
         callback();
         return;
      }
      const smsSend = await sendSMSMessage(phoneNumber, message);
      if (smsSend.success) {
         toast.success(smsSend.result!);
      } else {
         toast.error(smsSend.error!);
      }
      callback();
   }

   return (
      <AppWrapper>
         <div className="box pd-1 full">
            <div className="text-xl full bold-600">Send Sms</div>
         </div>
         <div className="box full">
            <div className="box full pd-1">
               <input
                  type="text"
                  className="xxs pd-12 pdx-15 full" 
                  placeholder="Receiving Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
               />
            </div>
            <div className="box full pd-1">
               <textarea 
                  id="message" 
                  name="message" 
                  placeholder="Description" 
                  className="xxs pd-12 pdx-15 full" 
                  style={{borderRadius:"12px"}}
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)}   
               />
            </div>
            <div className="box full pd-1">
               <AwaitButton className="xxs pd-12 pdx-2" onClick={sendSmsAction}>Send Message</AwaitButton>
            </div>
         </div>
      </AppWrapper>
   )
}
