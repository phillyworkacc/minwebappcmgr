'use client'
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import { changeClientPassword } from "@/app/actions/clients";
import { useModal } from "@/components/Modal/ModalContext";
import { LockKeyhole } from "lucide-react";
import { toast } from "sonner";

export default function ChangePassword ({ clientInfo }: { clientInfo: Client }) {
   const { showModal, close } = useModal();
   
   const changePasswordModal = () => {
      const changePwdBtn = async (callback: Function) => {
         const newPassword1InputBox: any = document.querySelector("#client-profile-new-pwd-1");
         const newPassword2InputBox: any = document.querySelector("#client-profile-new-pwd-2");

         const newPassword1 = newPassword1InputBox.value;
         const newPassword2 = newPassword2InputBox.value;

         if (newPassword1 == "" || newPassword2 == "") {
            toast.error("Please fill in all the fields");
            callback();
            return;
         }

         if (newPassword1 !== newPassword2) {
            toast.error("Passwords don't match");
            callback();
            return;
         }

         const changed = await changeClientPassword(clientInfo.clientid, newPassword1);
         if (changed) {
            toast.success(`Changed ${clientInfo.name}'s Password Successfully`);
            close();
         } else {
            toast.error(`Failed to change client's password`);
         }
         callback();
      }

      showModal({
         content: <div className="box full h-fit" style={{userSelect:"none"}}>
            <div className="text-l bold-700 text-center full">Change {clientInfo.name}'s Password</div>
            <div className="box full pd-2">
               <div className="text-xs full mb-05 grey-5">Password</div>
               <input 
                  type="text" className="xxs full pd-15 pdx-2"
                  id="client-profile-new-pwd-1"
                  placeholder="Password"
                  autoComplete="off"
               />
            </div>
            <div className="box full pd-2">
               <div className="text-xs full mb-05 grey-5">Password (again)</div>
               <input 
                  type="text" className="xxs full pd-15 pdx-2"
                  id="client-profile-new-pwd-2"
                  placeholder="Password (again)"
                  autoComplete="off"
               />
            </div>
            <div className="htv gap-10 mt-1">
               <button className="xxs full outline-black tiny-shadow pd-13" onClick={()=>close()}>Cancel</button>
               <AwaitButton className="xxs full tiny-shadow pd-13" onClick={changePwdBtn}>
                  Change Password
               </AwaitButton>
            </div>
         </div>
      })
   }

   return (
      <button className="xxxs grey tiny-shadow pd-1 pdx-15 whitespace-nowrap" onClick={changePasswordModal}>
         <LockKeyhole size={17} /> Change {clientInfo.name}'s Password
      </button>
   )
}
