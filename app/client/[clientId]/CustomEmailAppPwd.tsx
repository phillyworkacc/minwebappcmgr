'use client'
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import { changeClientAppPassword } from "@/app/actions/clients";
import { useModal } from "@/components/Modal/ModalContext";
import { useState } from "react";
import { toast } from "sonner";

type CustomEmailAppPwdProps = {
   clientInfo: Client;
   setClientInfo: Function;
}

export default function CustomEmailAppPwd ({ clientInfo, setClientInfo }: CustomEmailAppPwdProps) {
   const { close } = useModal();
   const [newAppPassword, setNewAppPassword] = useState(clientInfo.customGmailAppPassword || "");

   
   const addNewAppPasswordToClient = async (callback: Function) => {
      if (newAppPassword.trim() == "") {
         toast.error("Please enter an app password for this client");
         callback();
         return;
      }

      const updated = await changeClientAppPassword(clientInfo.clientid, newAppPassword);
      if (updated) {
         toast.success(`Updated ${clientInfo.name}'s App Password`);
         setClientInfo({ ...clientInfo, customGmailAppPassword: newAppPassword });
         close();
      } else {
         toast.error(`Failed to update profile`);
      }
      callback();
   }

   return (
      <div className="box full h-fit pdx-15 pd-2" style={{userSelect:"none"}}>
         <div className="text-l bold-700 text-center full">Change Custom Gmail App Password</div>
         <div className="box full pd-2">
            <div className="text-xs full mb-05 grey-5">App Password</div>
            <input 
               type="text" className="xxs full pd-15 pdx-2"
               placeholder="App Password" autoComplete="off"
               value={newAppPassword} onChange={e => setNewAppPassword(e.target.value)}
            />
         </div>
         <div className="htv gap-10 mt-1">
            <button className="xxs full outline-black tiny-shadow pd-13" onClick={()=>close()}>Cancel</button>
            <AwaitButton className="xxs full tiny-shadow pd-13" onClick={addNewAppPasswordToClient}>
               Save Changes
            </AwaitButton>
         </div>
      </div>
   )
}
