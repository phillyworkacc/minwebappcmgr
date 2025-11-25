'use client'
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createUserClient } from "../actions/clients";
import { toast } from "sonner";
import { UserRoundPlus } from "lucide-react";

export default function AddClientPage () {
   const router = useRouter();

   const [name, setName] = useState("")
   const [description, setDescription] = useState("")
   const [email, setEmail] = useState("")
   const [image, setImage] = useState("")

   const addClientButton = async (callback: Function) => {
      const defaultClientImage = "https://minwebappcmgr.vercel.app/clientdefault.jpg";
      const result = await createUserClient(name, email, description, `${(image == "") ? defaultClientImage : image}`);
      if (result) {
         toast.success(name + " (Client) has been added");
         router.push("/clients");
      } else {
         toast.error("Failed to add client. Please try again.");
      }
      callback();
   }
   
   return (
      <AppWrapper>
         <Breadcrumb 
            pages={[
               { href: "/clients", label: "Clients" },
               { href: "", label: "Add Client" }
            ]}
         />
      
         <div className="box pd-1 full mb-1">
            <div className="text-xl full bold-600">Create Client</div>
            <div className="text-xxs full">Please enter the following details about the new client</div>
         </div>
         <div className="box full">
            <div className="box full pd-1">
               <input
                  type="text"
                  className="xxs pd-12 pdx-15 full" 
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
               />
            </div>
            <div className="box full pd-1">
               <input
                  type="email"
                  className="xxs pd-12 pdx-15 full" 
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
               />
            </div>
            <div className="box full pd-1">
               <textarea 
                  id="description" 
                  name="description" 
                  placeholder="Description" 
                  className="xxs pd-12 pdx-15 full" 
                  style={{borderRadius:"12px"}}
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}   
               />
            </div>
            <div className="box full pd-1">
               <input 
                  type="text" 
                  className="xxs pd-12 pdx-15 full" 
                  placeholder="Image URL" 
                  value={image} 
                  onChange={(e) => setImage(e.target.value)} 
               />
            </div>
            <div className="box full pd-1">
               <AwaitButton className="xxs pd-12 pdx-2" onClick={addClientButton}>
                  <UserRoundPlus size={17} /> Add Client
               </AwaitButton>
            </div>
         </div>
      </AppWrapper>
   )
}
