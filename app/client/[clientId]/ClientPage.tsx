'use client'
import AppWrapper from "@/components/AppWrapper/AppWrapper"
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Select from "@/components/Select/Select";
import Card from "@/components/Card/Card";
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import AllPaymentsTable from "@/components/Table/AllPaymentsTable";
import Spacing from "@/components/Spacing/Spacing";
import WebsitesSection from "./WebsitesSection";
import EditProfile from "./EditProfile";
import { useState } from "react";
import { useModal } from "@/components/Modal/ModalContext";
import { formatMilliseconds } from "@/utils/date";
import { toast } from "sonner";
import { copyToClipboard, titleCase } from "@/lib/str";
import { CustomUserIcon } from "@/components/Icons/Icon";
import { ClientStatusIndicatorFit } from "@/components/ClientStatusIndicator/ClientStatusIndicator";
import { clientStatusInfo } from "@/utils/funcs";
import { Check, Copy, Edit, Mail, Rocket, Trash2, Wrench, X } from "lucide-react";
import { deleteClientAccount, updateClientInfoNotes, updateClientInfoStatus } from "@/app/actions/clients";
import { formatNumber } from "@/utils/num";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ListView from "@/components/ListView/ListView";
import ChangePassword from "./ChangePassword";

type ClientPageProps = {
   client: Client;
   websites: Website[];
   clientPayments: ClientPayment[];
}

export function clientStatusIcon (status: ClientStatus) {
   if (status == "beginning") {
      return <Rocket size={17} />
   } else if (status == "failed") {
      return <X size={17} />
   } else if (status == "finished") {
      return <Check size={17} />
   } else if (status == "working") {
      return <Wrench size={17} />
   }
}

export default function ClientPage ({ client, websites, clientPayments }: ClientPageProps) {
   const { showModal, close } = useModal();
   const router = useRouter();
   const [clientInfo, setClientInfo] = useState<Client>(client);
   const [clientNotes, setClientNotes] = useState(client.notes);
   const [toggleEditNote, setToggleEditNote] = useState(false);
   const clientReviews = client.review.split("@@!!@@").filter(r => r !== '');
   const totalClientPayments = clientPayments.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

   const updateNote = async (callback: Function) => {
      const updatedNote = await updateClientInfoNotes(client.clientid, clientNotes);
      if (updatedNote.success) {
         toast.success("Saved Note");
      } else {
         toast.error("Failed to save note");
      }
      setToggleEditNote(prev => !prev);
      callback();
   }

   const updateStatus = async (newStatus: ClientStatus) => {
      setClientInfo((prev) => ({ ...prev, status: newStatus }))
      const updatedStatus = await updateClientInfoStatus(client.clientid, newStatus);
      if (updatedStatus.success) {
         toast.success("Updated Status");
      } else {
         toast.error("Failed to update status");
      }
   }

   const deleteAccountModal = () => {
      const deleteAccountBtn = async (callback: Function) => {
         const deleted = await deleteClientAccount(clientInfo.clientid);
         if (deleted) {
            router.push('/clients');
            callback();
            close();
         } else {
            toast.error("Failed to delete client");
            callback();
         }
      }

      showModal({
         content: <div className="box full h-fit" style={{userSelect:"none"}}>
            <div className="text-sm bold-500 text-center full">Are you sure you want to delete {clientInfo.name}'s Client Account ?</div>
            <div className="htv gap-10 mt-2">
               <button className="xxs full outline-black tiny-shadow pd-13" onClick={()=>close()}>Cancel</button>
               <AwaitButton className="xxs full delete tiny-shadow pd-13" onClick={deleteAccountBtn}>
                  <Trash2 size={17} /> Delete Client
               </AwaitButton>
            </div>
         </div>
      })
   }

   const copyReviewLink = () => {
      copyToClipboard(`https://app.minwebagency.com/review/${clientInfo.clientid}`);
      toast.success("Copied");
   }

   return (
      <AppWrapper>
         <Breadcrumb 
            pages={[
               { href: "/clients", label: "Clients" },
               { href: "/client/clientId", label: `${client.name}` },
            ]}
         />

         <div className="text-xxxs full grey-4 mt-2">Client</div>
         <div className="htv mt-05 mb-05">
            <div className="box full dfb column">
               <div className="text-l full bold-600 dfb align-center gap-10 pd-1">
                  <CustomUserIcon url={clientInfo.image} size={40} round />
                  <div className="text-l fit">{clientInfo.name}</div>
                  <ClientStatusIndicatorFit status={clientInfo.status} />
               </div>
               <div className="text-xxs pd-05 full">{clientInfo.description}</div>
               <div className="text-xxs pd-05">Started working with {clientInfo.name} on {formatMilliseconds(parseInt(clientInfo.createdat), true)}</div>
               <div className="text-xxs pd-05">Last updated on {formatMilliseconds(parseInt(clientInfo.latestupdate), true)}</div>
               <div className="htv mt-05 mb-05 gap-10 align-start justify-start">
                  {(clientInfo.email !== '') && (<Link href={`mailto:${clientInfo.email}`}>
                     <button className="xxxs fit pd-1 pdx-15 tiny-shadow whitespace-nowrap">
                        <Mail size={17} /> Email {clientInfo.name}
                     </button>
                  </Link>)}
                  <EditProfile clientInfo={clientInfo} setClientInfo={setClientInfo} />
                  <ChangePassword clientInfo={clientInfo} />
               </div>
            </div>
         </div>

         <WebsitesSection clientInfo={clientInfo} websites={websites} />

         <div className="box full pd-15">
            <Card styles={{padding: "25px", boxShadow: "0 1px 3px rgba(0,0,0,0.098)"}}>
               <div className="text-sm full bold-700 mb-15">Payments from {clientInfo.name}</div>
               <div className="text-xxs grey-5 full">Revenue made from {clientInfo.name}</div>
               <div className="text-xl full bold-800 mb-2">{
                  formatNumber(totalClientPayments, {
                     prefix: "£", useCommas: true, showDecimals: true, decimalPlaces: 2
                  })
               }</div>
               <AllPaymentsTable payments={clientPayments} />
            </Card>
         </div>

         <div className="box full pd-15">
            <Card styles={{boxShadow: "0 1px 3px rgba(0,0,0,0.098)", padding: "20px" }}>
               <div className="box full dfb align-center mb-1">
                  <div className="text-sm full bold-700">Client Status</div>
                  <Select
                     options={["beginning","working","finished","failed"].map(s => titleCase(s))}
                     onSelect={option => updateStatus(option.toLowerCase())}
                     defaultOptionIndex={["beginning","working","finished","failed"].indexOf(clientInfo.status)}
                  />
               </div>
               <div className="box full dfb align-center gap-10">
                  <div 
                     className="box fit h-fit pd-1 pdx-1 dfb align-center justify-center"
                     style={{ aspectRatio: '1', borderRadius: "100%", background: `${clientStatusInfo(clientInfo.status)?.color}`, color: "white" }} 
                  >
                     {clientStatusIcon(clientInfo.status)}
                  </div>
                  <div className="box full dfb column">
                     <div className="text-xxs bold-600 fit">{titleCase(clientInfo.status)}</div>
                     <div className="text-t grey-4">{clientStatusInfo(clientInfo.status)?.desc}</div>
                  </div>
               </div>
            </Card>
         </div>

         <div className="box full pd-15">
            <Card styles={{boxShadow: "0 1px 3px rgba(0,0,0,0.098)", padding: "20px 25px" }}>
               <div className="box full dfb align-center mb-1">
                  <div className="text-sm full bold-700">Client Notes</div>
               </div>
               {(toggleEditNote) ? (<>
                  <textarea 
                     name="client-notes"
                     id="client-notes"
                     className="xxs pd-15 pdx-15 full h-30"
                     value={clientNotes}
                     onChange={e => setClientNotes(e.target.value)}
                     placeholder="Add a note"
                  />
                  <div className="box full pd-1 dfb align-center gap-10">
                     <AwaitButton className="xxxs pd-11 pdx-4" onClick={updateNote}>Save</AwaitButton>
                     <button className="xxxs pd-11 pdx-4 outline-black tiny-shadow" onClick={()=>setToggleEditNote(prev => !prev)}>Cancel</button>
                  </div>
               </>) : (<>
                  <div className="text-xxs full grey-5" style={{whiteSpace:"pre-wrap"}}>{clientNotes}</div>
                  <div className="box full pd-1">
                     <button className="xxxs pd-11 pdx-3" onClick={()=>setToggleEditNote(prev => !prev)}><Edit size={17} /> Edit</button>
                  </div>
               </>)}
            </Card>
         </div>

         <div className="box full pd-15">
            <div className="text-ml full bold-700">Reviews</div>
            {(clientReviews.length > 0) ? (<>
               <div className="box full pd-1">
                  <ListView 
                     items={clientReviews}
                     itemDisplayComponent={(review: string) => (
                        <div className="box full dfb column pd-05 pdx-1">
                           <div className="box full dfb align-center gap-10">
                              <div className="box fit dfb align-center gap-10">
                                 <div className="box fit h-full">
                                    <CustomUserIcon size={25} url={clientInfo.image} round />
                                 </div>
                                 <div className="text-xs full bold-600">{clientInfo.name}</div>
                              </div>
                           </div>
                           <div className="text-xxs full mt-1">{review}</div>
                        </div>
                     )}
                  />
               </div>
            </>) : (<>No Reviews from {clientInfo.name}</>)}
            <div className="box full pd-05">
               <button className="xxxs pd-1 pdx-15 grey tiny-shadow" onClick={copyReviewLink}>
                  <Copy size={15} /> Copy Review Link
               </button>
            </div>
         </div>

         <div className="box full pd-15">
            <div className="text-ml full bold-700">Client Presence</div>
            <div className="text-xxs full mb-1">This is a permanent action and it cannot be reversed</div>
            <button className="xxs pd-1 pdx-2 delete" onClick={deleteAccountModal}>
               <Trash2 size={17} /> Delete Client
            </button>
         </div>
         
         <Spacing size={4} />
      </AppWrapper>
   )
}
