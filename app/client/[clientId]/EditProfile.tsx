'use client'
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import { editClientProfile } from "@/app/actions/clients";
import { CustomUserIcon } from "@/components/Icons/Icon";
import { useModal } from "@/components/Modal/ModalContext";
import { Edit } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function ImageUrlViewer ({ imageUrl }: { imageUrl: string }) {
   const [imageLink, setImageLink] = useState(imageUrl);

   return (<>
      <div className="box full pd-2">
         <div className="text-xs full grey-5">Client Profile Image</div>
         <div className="box full pd-1 mb-1">
            <CustomUserIcon 
               url={imageLink} size={120} round
            />
         </div>
         <input 
            type="text" className="xxs full pd-15 pdx-2"
            id="client-profile-edit-image"
            placeholder="Client Name" autoComplete="off"
            value={imageLink} onChange={e => setImageLink(e.target.value)}
         />
      </div>
   </>)
}

export default function EditProfile ({ clientInfo, setClientInfo }: { clientInfo: Client, setClientInfo: Function }) {
   const { showModal, close } = useModal();

   
   const editProfileModal = () => {
      const addWebsiteBtn = async (callback: Function) => {
         const clientImageInputBox: any = document.querySelector("#client-profile-edit-image");
         const clientNameInputBox: any = document.querySelector("#client-profile-edit-name");
         const clientEmailInputBox: any = document.querySelector("#client-profile-edit-email");
         const clientDescriptionInputBox: any = document.querySelector("#client-profile-edit-desc");

         const name = clientNameInputBox.value;
         const desc = clientDescriptionInputBox.value;
         const email = clientEmailInputBox.value;
         const image = clientImageInputBox.value;

         if (name == "" || desc == "" || email == "" || image == "") {
            toast.error("Please fill in all the fields");
            callback();
            return;
         }

         const edited = await editClientProfile(clientInfo.clientid, { name, desc, email, image });
         if (edited) {
            toast.success(`Updated ${name}'s Profile Successfully`);
            setClientInfo({
               ...clientInfo,
               name: name, description: desc, email, image
            });
            close();
         } else {
            toast.error(`Failed to update profile`);
         }
         callback();
      }

      showModal({
         content: <div className="box full h-fit" style={{userSelect:"none"}}>
            <div className="text-l bold-700 text-center full">Edit {clientInfo.name}'s Profile</div>
            <ImageUrlViewer imageUrl={clientInfo.image} />
            <div className="box full pd-2">
               <div className="text-xs full mb-05 grey-5">Name</div>
               <input 
                  type="text" className="xxs full pd-15 pdx-2"
                  id="client-profile-edit-name"
                  placeholder="Client Name"
                  autoComplete="off" defaultValue={clientInfo.name}
               />
            </div>
            <div className="box full pd-2">
               <div className="text-xs full mb-05 grey-5">Email</div>
               <input 
                  type="text" className="xxs full pd-15 pdx-2"
                  id="client-profile-edit-email"
                  placeholder="Client Email"
                  autoComplete="off" defaultValue={clientInfo.email}
               />
            </div>
            <div className="box full pd-2">
               <div className="text-xs full mb-05 grey-5">Description</div>
               <textarea 
                  className="xxs full pd-15 pdx-2"
                  id="client-profile-edit-desc"
                  placeholder="Client Description"
                  autoComplete="off" defaultValue={clientInfo.description}
               />
            </div>
            <div className="htv gap-10 mt-1">
               <button className="xxs full outline-black tiny-shadow pd-13" onClick={()=>close()}>Cancel</button>
               <AwaitButton className="xxs full tiny-shadow pd-13" onClick={addWebsiteBtn}>
                  Save Changes
               </AwaitButton>
            </div>
         </div>
      })
   }

   return (
      <button className="xxxs grey tiny-shadow pd-1 pdx-15" onClick={editProfileModal}>
         <Edit size={17} /> Edit {clientInfo.name}'s Profile
      </button>
   )
}
