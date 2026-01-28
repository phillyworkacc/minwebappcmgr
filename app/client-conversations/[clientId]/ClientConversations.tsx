'use client'
import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import ConversationBox from "@/components/ConversationBox/ConversationBox";

type ClientConversationsProps = {
   clientInfo: Client;
   clientConversations: ConversationList[];
}

export default function ClientConversations ({ clientInfo, clientConversations }: ClientConversationsProps) {
   return (
      <AppWrapper>
         <Breadcrumb 
            pages={[
               { href: `/client-tws/${clientInfo.clientid}`, label: clientInfo.name },
               { href: "/client-conversations", label: `Conversations` },
            ]}
            hideDashboardLink
         />
         <div className="box full dfb column pd-1">
            <div className="text-l full bold-700">{clientInfo.name}'s Conversations</div>
         </div>
         
         <ConversationBox conversations={clientConversations} />
      </AppWrapper>
   )
}
