"use client"
import { getWebsiteMetadata } from "@/app/actions/extras";
import { SquareArrowOutUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import { CustomUserIcon, WebsiteIcon } from "../Icons/Icon";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DefaultWebsiteIcon from "@/public/loading-site.png";

type ClientWebsiteProps = {
   website: Website;
   clientInfo: Client;
}

export default function ClientWebsite ({ website, clientInfo }: ClientWebsiteProps) {
   const router = useRouter();
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

   return (
      <>
         <div className="box full dfb align-center gap-10">
            <div className="box h-full fit">
               <WebsiteIcon url={metadata.icon} size={40} round />
            </div>
            <div className="box full dfb column">
               <div className="text-s full bold-600">{metadata.websiteTitle}</div>
               <div className="box fit dfb align-center justify-center gap-10 mt-05" style={{cursor:"pointer"}} onClick={() => router.push(`/client/${clientInfo.clientid}`)}>
                  <CustomUserIcon url={clientInfo.image} size={20} round />
                  <div className="text-xxxs fit">{clientInfo.name}</div>
               </div>
            </div>
         </div>
         <div className="box full dfb align-center wrap gap-20 mt-05 pd-1">
            <Link className="text-xxxs fit" href={`https://${website.url}`} target="_blank">
               <button className="xxxs fit outline-black tiny-shadow">
                  Visit {website.url} <SquareArrowOutUpRight size={13} />
               </button>
            </Link>
         </div>
      </>
   )
}