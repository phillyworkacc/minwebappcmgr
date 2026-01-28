'use client'
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Spacing from "@/components/Spacing/Spacing";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createUserClientTws } from "../actions/clients";
import { toast } from "sonner";
import { UserRoundPlus } from "lucide-react";
import { isValidUKMobile } from "@/utils/funcs";

export default function AddClientTWSPage () {
   const router = useRouter();

   const [name, setName] = useState("");
   const [description, setDescription] = useState("");
   const [email, setEmail] = useState("");
   const [phoneNumber, setPhoneNumber] = useState("");
   const [businessName, setBusinessName] = useState("");
   const [twilioPhoneNumber, setTwilioPhoneNumber] = useState("");
   const [password, setPassword] = useState("");
   const [image, setImage] = useState("");

   const addClientButton = async (callback: Function) => {
      if (name == "") {
         toast.error("Please enter a name for this client.");
         callback();
         return;
      }
      if (businessName == "") {
         toast.error("Please enter a name for the client's business.");
         callback();
         return;
      }
      if (!isValidUKMobile(phoneNumber)) {
         toast.error("Please enter a valid business phone number for this client.");
         callback();
         return;
      }
      if (!isValidUKMobile(twilioPhoneNumber)) {
         toast.error("Please enter a valid twilio phone number for this client.");
         callback();
         return;
      }
      if (password == "") {
         toast.error("Please enter a password for this client.");
         callback();
         return;
      }
      const defaultClientImage = "https://minwebappcmgr.vercel.app/clientdefault.jpg";
      const result = await createUserClientTws(
         name, email, phoneNumber, description, image !== "" ?  image : defaultClientImage, 
         businessName, twilioPhoneNumber, password
      );
      if (result) {
         toast.success(name + " (Client) has been added");
         router.push("/clients-tws");
      } else {
         toast.error("Failed to add client. Please try again.");
      }
      callback();
   }
   
   return (
      <AppWrapper>
         <Breadcrumb 
            pages={[
               { href: "/clients-tws", label: "TWS Clients" },
               { href: "", label: "Add TWS Client" }
            ]}
         />
      
         <div className="box pd-1 full mb-1">
            <div className="text-xl full bold-600">Create TWS Client</div>
            <div className="text-xxs full">Please enter the following details about the new client</div>
         </div>
         <div className="box full">
            <div className="text-sm bold-600">Client Information</div>
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
            <br /><br />
            <div className="text-sm bold-600">Business Information</div>
            <div className="box full pd-1">
               <input
                  type="text"
                  className="xxs pd-12 pdx-15 full" 
                  placeholder="Business Name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
               />
            </div>
            <div className="box full pd-1">
               <input
                  type="text"
                  className="xxs pd-12 pdx-15 full" 
                  placeholder="Business Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
               />
            </div>
            <div className="box full pd-1">
               <input
                  type="text"
                  className="xxs pd-12 pdx-15 full" 
                  placeholder="Twilio Phone Number"
                  value={twilioPhoneNumber}
                  onChange={(e) => setTwilioPhoneNumber(e.target.value)}
               />
            </div>
            <div className="box full pd-1">
               <input
                  type="text"
                  className="xxs pd-12 pdx-15 full" 
                  placeholder="Client Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
               />
            </div>
            <div className="box full pd-1">
               <AwaitButton className="xxs pd-12 pdx-2" onClick={addClientButton}>
                  <UserRoundPlus size={17} /> Add TWS Client
               </AwaitButton>
            </div>
            <Spacing size={5} />
         </div>
      </AppWrapper>
   )
}
