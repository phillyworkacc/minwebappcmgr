'use client'

import './Client.css'
import { defaultClientImage } from "@/utils/constants";
import { useRouter } from 'next/navigation';
import { clientStatusInfo } from '@/utils/funcs';

type ClientProps = {
   client: Client;
}

export default function Client({ client }: ClientProps) {
   const router = useRouter();

   return (
      <div className="client" onClick={() => router.push(`/client/${client.clientid}`)}>
         <div className="image">
            <img src={client.image || defaultClientImage} alt="client image" />
         </div>
         <div className="name text-c-xs bold-500">{client.name}</div>
         <div className="status">
            <div className="identifier" style={{ background: `${clientStatusInfo(client.status)?.color}` }}></div>
         </div>
      </div>
   )
}
