'use client'
import AwaitButton from "@/components/AwaitButton/AwaitButton";
import Card from "@/components/Card/Card";
import { useModal } from "@/components/Modal/ModalContext";
import { CirclePlus, SquareArrowOutUpRight, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { addWebsite, removeWebsiteFromClient } from "@/app/actions/websites";
import { useEffect, useState } from "react";
import { getWebsiteMetadata } from "@/app/actions/extras";
import { WebsiteIcon } from "@/components/Icons/Icon";
import DefaultWebsiteIcon from "@/public/loading-site.png";
import Link from "next/link";

export default function WebsitesSection({ clientInfo, websites }: { clientInfo: Client, websites: Website[] }) {
   const { showModal, close } = useModal();
   const [clientWebsites, setClientWebsites] = useState<Website[]>([...websites]);

   const addWebsiteModal = () => {
      const addWebsiteBtn = async (callback: Function) => {
         const websiteUrlInputBox: any = document.querySelector("#website-url-modal-input-text");
         const websiteUrl = websiteUrlInputBox.value;
         if (websiteUrl.startsWith("http")) {
            toast.error("Please just enter the domain");
            callback();
            return;
         }
         const added = await addWebsite(clientInfo.clientid, websiteUrl.replaceAll("/",""));
         if (added) {
            toast.success("Added Website: " + websiteUrl);
            setClientWebsites(p => ([...p, {
               id: 100,
               userid: clientInfo.userid,
               clientid: clientInfo.clientid,
               websiteid: 'websiteid',
               url: websiteUrl.replaceAll("/",""),
               date: `${Date.now}`
            }]))
            close();
         } else {
            toast.error("Failed to add website");
         }
         callback();
      }

      showModal({
         content: <div className="box full h-fit" style={{userSelect:"none"}}>
            <div className="text-l bold-700 text-center full">Add a Website</div>
            <div className="box full pd-2">
               <input 
                  type="text" className="xxs full pd-15 pdx-2"
                  id="website-url-modal-input-text"
                  placeholder="Website URL (example.com)"
                  autoComplete="off"
               />
            </div>
            <div className="htv gap-10 mt-1">
               <button className="xxs full outline-black tiny-shadow pd-13" onClick={()=>close()}>Cancel</button>
               <AwaitButton className="xxs full tiny-shadow pd-13" onClick={addWebsiteBtn}>
                  <CirclePlus size={17} /> Add Website
               </AwaitButton>
            </div>
         </div>
      })
   }

   const removeWebsite = (wid: string) => {
      setClientWebsites(p => p.filter(w => (w.websiteid !== wid)))
   }

   return (
      <div className="box full pd-15">
         <Card styles={{padding: "25px", boxShadow: "0 1px 3px rgba(0,0,0,0.098)"}}>
            <div className="box full dfb align-center gap-10 mb-15">
               <div className="text-sm full bold-700">Websites</div>
               <div className="box fit">
                  <button className="xxxs pd-1 pdx-15" onClick={addWebsiteModal}><CirclePlus size={15} /> Add</button>
               </div>
            </div>
            {clientWebsites.length == 0 && (<>No website found for {clientInfo.name}</>)}
            <div className="box full dfb column gap-10">
               {clientWebsites.map((clientWebsite, index) => (
                  <WebsiteCard key={index} website={clientWebsite} clientInfo={clientInfo} removeWebsite={removeWebsite} />
               ))}
            </div>
         </Card>
      </div>
   )
}

function WebsiteCard ({ website, clientInfo, removeWebsite }: { website: Website, clientInfo: Client, removeWebsite: Function }) {
   const { showModal, close } = useModal();
   const [metadata, setMetadata] = useState({
      websiteTitle: website.url, icon: DefaultWebsiteIcon.src
   })

   const loadMetadata = async () => {
      const siteMetadata = await getWebsiteMetadata(`https://${website.url}`);
      if (siteMetadata !== null) setMetadata(siteMetadata);
   }

   useEffect(() => {
      const load = () => loadMetadata();
      load();
   }, [])
   
   const removeWebsiteModal = () => {
      const removeWebsiteBtn = async (callback: Function) => {
         const removed = await removeWebsiteFromClient(website.clientid, website.websiteid, clientInfo.websites);
         if (removed) {
            toast.success("Removed Website: " + website.url);
            removeWebsite(website.websiteid);
            close();
         } else {
            toast.error("Failed to remove website");
         }
         callback();
      }

      showModal({
         content: <div className="box full h-fit" style={{userSelect:"none"}}>
            <div className="text-sm bold-500 text-center full">Are you sure you want to remove {website.url} ?</div>
            <div className="htv gap-10 mt-2">
               <button className="xxs full outline-black tiny-shadow pd-13" onClick={()=>close()}>Cancel</button>
               <AwaitButton className="xxs full delete tiny-shadow pd-13 whitespace-nowrap" onClick={removeWebsiteBtn}>
                  <Trash2 size={17} /> Remove Website
               </AwaitButton>
            </div>
         </div>
      })
   }

   return (
      <Card styles={{
         padding: "10px 15px", borderRadius: "8px",
         boxShadow: "none", cursor: "default"
      }}>
         <div className="box full dfb align-center gap-10">
            <div className="box h-full fit">
               <WebsiteIcon url={metadata.icon} size={40} />
            </div>
            <div className="box full dfb column">
               <div className="text-xxs full bold-600">{metadata.websiteTitle}</div>
               <div className="text-xxxs full grey-5">{website.url}</div>
               <div className="box full dfb align-center wrap gap-20">
                  <Link className="text-xxxs fit grey-4 visible-link dfb align-center gap-5" href={`https://${website.url}`} target="_blank">
                     Visit Website <SquareArrowOutUpRight size={13} />
                  </Link>
                  <div className="text-xxxs fit error-text visible-link dfb align-center gap-5" onClick={removeWebsiteModal}>
                     Remove Website <Trash2 size={13} />
                  </div>
               </div>
            </div>
         </div>
      </Card>
   )
}