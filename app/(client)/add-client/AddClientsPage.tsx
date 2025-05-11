'use client'

import "@/styles/home.css"
import { useSession } from 'next-auth/react';
import { useUser } from '../../context/UserContext';
import { useState } from 'react'
import { wait } from "@/utils/wait";
import { createUserClient } from "../../Actions/Clients";
import { defaultClientImage } from "@/utils/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Navbar from '@/components/Navbar/Navbar';
import BackTick from "@/components/BackTick/BackTick";
import React from "react";
import LoadingAddClientsPage from "./LoadingAddClientsPage";

export default function AddClientsPage() {
   const { data: session, status } = useSession();
   const { user } = useUser();
   const router = useRouter();

   const [name, setName] = useState("")
   const [description, setDescription] = useState("")
   const [image, setImage] = useState("")
   const [error, setError] = useState<CustomError>({ status: false, message: "" });
   const [buttonLoading, setButtonLoading] = useState(false);

   const addClientButton = async () => {
      setButtonLoading(true);
      await wait(0.2);
      const result = await createUserClient(name, description, `${(image == "") ? defaultClientImage : image}`);
      if (result) {
         toast.success(name + " (Client) has been added")
         router.push("/clients");
      } else {
         setError({ status: true, message: "Failed to add client. Please try again." })
      }
      setButtonLoading(false);
   }

   if (status == "loading") return <LoadingAddClientsPage />;
   if (!session?.user) return <LoadingAddClientsPage />;
   if (!user) return <LoadingAddClientsPage />;

   return (<div className={`home-page ${user.color_theme}`}>
      <Navbar page="clients" />
      <div className="app-content">
         <BackTick action={() => router.push('/clients')}>Back to Clients</BackTick>

         <div className="text-c-xl bold-700 pd-2">Add Client</div>

         {/* // ! error handling */}
         {(error.status && error.message !== "") ? <>
            <div className="text-c-s error">{error.message}</div>
         </> : <></>}
         
         <div className="text-c-s pd-1 full-width">
            <input type="text" className="full max" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
         </div>
         <div className="text-c-s pd-1 full-width">
            <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
         </div>
         <div className="text-c-s pd-1 full-width">
            <input type="text" className="full max" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
         </div>

         <div className="text-c-s pd-1">
            <button className="full max" onClick={addClientButton} disabled={buttonLoading}>
               {buttonLoading ? 'Loading...' : 'Add Client'}
            </button>
         </div>

      </div>
   </div>)
}
