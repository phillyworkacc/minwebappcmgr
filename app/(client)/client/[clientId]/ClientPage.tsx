'use client'

import "@/styles/home.css"
import { useSession } from 'next-auth/react';
import { useUser } from '@/app/context/UserContext';
import { useEffect, useState } from 'react'
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getUserClientInfo, updateClientInfoNotes, updateClientInfoStatus } from "@/app/Actions/Clients";
import { clientStatusInfo } from "@/utils/funcs";
import { Check, Copy, Edit, Rocket, Wrench, X } from "lucide-react";
import { appUrl } from "@/utils/constants";
import { formatDateTime, formatDateV2 } from "@/utils/date";
import Navbar from '@/components/Navbar/Navbar';
import BackTick from "@/components/BackTick/BackTick";
import React from "react";
import LoadingClientPage from "./LoadingClientPage";
import Modal from "@/components/Modal/Modal";


const clientStatusIcon = (status: ClientStatus) => {
   if (status == "beginning") {
      return <Rocket />
   } else if (status == "failed") {
      return <X />
   } else if (status == "finished") {
      return <Check />
   } else if (status == "working") {
      return <Wrench />
   }
}

const clientReviewFormat = (clientName: string, review: string) => {
   if (review == "") return <>No reviews received from {clientName}</>;
   
   const reviews = review.split("@@!!@@");
   if (reviews.length > 0) {
      return <>{reviews.map((rvw, index) => {
         return <div className="client-review-item" key={index}>{`"${rvw}"`}</div>
      })}</>
   } else {
      return <>No reviews received from {clientName}</>
   }
}

export default function ClientPage({ clientId }: { clientId: string }) {
   const { data: session, status } = useSession();
   const { user } = useUser();
   const router = useRouter();
   const [client, setClient] = useState<Client | null>(null)
   const [showChangeStatusModal, setShowChangeStatusModal] = useState(false)
   const [clientStatusChanger, setClientStatusChanger] = useState<ClientStatus>("beginning")
   const [clientPageMgr, setClientPageMgr] = useState<"main" | "notes">("main")
   const [clientNotes, setClientNotes] = useState("")

   const loadClientInfo = async () => {
      const clientInfo = await getUserClientInfo(clientId);
      setClient(clientInfo);
      setClientStatusChanger(clientInfo.status);
      setClientNotes(clientInfo.notes);
   }

   const changeClientStatusBtn = async () => {
      const res = await updateClientInfoStatus(clientId, clientStatusChanger);
      if (res) {
         setClient({
            ...client,
            status: clientStatusChanger
         } as Client)
         toast.success(`Changed client status to (${clientStatusChanger})`)
         setShowChangeStatusModal(false)
      } else {
         toast.error(`Failed to save client status as (${clientStatusChanger})`)
      }
   }

   const updateClientNotesBtn = async () => {
      const res = await updateClientInfoNotes(clientId, clientNotes);
      if (res) {
         setClient({
            ...client,
            notes: clientNotes
         } as Client)
         toast.success(`Updated ${client?.name} (client) notes`)
      } else {
         toast.error(`Failed to update client notes`)
      }
   }

   const copyToClipboard = (txt: string) => {
      try {
         navigator.clipboard.writeText(txt);
         toast.success("Copied to clipboard")
      } catch (err) {}
   }

   useEffect(() => {
      loadClientInfo();
   }, [])

   if (status == "loading") return <LoadingClientPage />;
   if (!session?.user) return <LoadingClientPage />;
   if (!user) return <LoadingClientPage />;
   if (client == null) return <LoadingClientPage />;

   return (<div className={`home-page ${user.color_theme}`}>
      <Navbar />
      <div className="app-content">

         {(clientPageMgr == "main") ? <>
            <Modal 
               title="Change Status" 
               showModal={showChangeStatusModal} 
               closeAction={() => setShowChangeStatusModal(false)}>
               <div className="status-selector">
                  <div 
                     className={`status-option ${clientStatusChanger == "beginning" ? 'selected' : ''}`}
                     onClick={() => setClientStatusChanger("beginning")}
                  >Beginning</div>
                  <div 
                     className={`status-option ${clientStatusChanger == "working" ? 'selected' : ''}`}
                     onClick={() => setClientStatusChanger("working")}
                  >Working</div>
                  <div 
                     className={`status-option ${clientStatusChanger == "finished" ? 'selected' : ''}`}
                     onClick={() => setClientStatusChanger("finished")}
                  >Finished</div>
                  <div 
                     className={`status-option ${clientStatusChanger == "failed" ? 'selected' : ''}`}
                     onClick={() => setClientStatusChanger("failed")}
                  >Failed</div>
               </div><br />
               <button onClick={changeClientStatusBtn}>Change</button>
            </Modal>

            <BackTick action={() => router.push('/clients')}>Back to Clients</BackTick>

            <div className="client-image">
               <img src={client.image} alt="client image" />
            </div>
            <div className="text-c-xl bold-700 pd-2">{client.name}</div>
            <div className="text-c-xs grey">{client.description}</div>
            
            <br />

            <div className="client-status">
               <div className="status-info">
                  <div className="status-icon" style={{
                     color: `${clientStatusInfo(client.status)?.color}`,
                     borderColor: `${clientStatusInfo(client.status)?.color}`,
                  }}>
                     {clientStatusIcon(client.status)}
                  </div>
                  <div className="status-details">
                     <div className="text-c-s bold-600">{clientStatusInfo(client.status)?.name}</div>
                     <div className="text-c-xxs grey">{clientStatusInfo(client.status)?.desc}</div>
                  </div>
               </div>
               <div className="action">
                  <button onClick={() => setShowChangeStatusModal(true)}>Change Status</button>
               </div>
            </div>

            <br />

            <div className="client-section">
               <div className="text-c-sm bold-600 pd-1 dfb">
                  <div className="text-c-m bold-600 full flex-fill">Notes</div>
                  <button onClick={() => setClientPageMgr("notes")}><Edit size={16} /> Note</button>
               </div>
               <div className="text-c-xxs grey">
                  {(client.notes == "") 
                  ? <div className="text-c-xxs italicise">Nothing here, you should add something</div>
                  : client.notes}
               </div><br />
            </div>
            
            <br /><br />

            <div className="client-section">
               <div className="text-c-sm bold-600 pd-1 dfb">
                  <div className="text-c-m bold-600 full flex-fill">Reviews</div>
                  <button 
                     onClick={() => copyToClipboard(`${appUrl}/review/${clientId}`)}
                  ><Copy size={16} /> Link</button>
               </div>
               <div className="text-c-xxs grey" style={{wordWrap: "break-word"}}>{appUrl}/review/{clientId}</div>
               <div className="text-c-xxs grey pd-1">{clientReviewFormat(client.name, client.review)}</div><br />
            </div>
            
            <br /><br />
            <div className="text-c-xs pd-2">Last update on Client {`[${client.name}]`} was at on {formatDateTime(parseInt(client.latestupdate))}</div>
            <div className="text-c-xs pd-2">Started working with {client.name} on {formatDateV2(parseInt(client.createdat))}</div>
         
         </> : <>
            <BackTick action={() => setClientPageMgr("main")}>Back to Client</BackTick>
            <div className="client-notes-textarea">
               <textarea value={clientNotes} onChange={(e) => setClientNotes(e.target.value)} placeholder={`${client.name} Notes...`} />
            </div>
            <div className="client-notes-action">
               <button className="full" onClick={updateClientNotesBtn}>Save Notes</button>
            </div>
         </>}

      </div>
   </div>)
}
