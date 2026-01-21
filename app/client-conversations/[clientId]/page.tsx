import AppWrapper from "@/components/AppWrapper/AppWrapper";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import ConversationBox from "@/components/ConversationBox/ConversationBox";


type ClientConversationsProps = {
   params: Promise<{
      clientId: string;
   }>
}

export default async function ClientConversations ({ params }: ClientConversationsProps) {
   const { clientId } = await params;
   
   return (
      <AppWrapper>
         <Breadcrumb 
            pages={[
               { href: `/client-tws/${clientId}`, label: "Jake" },
               { href: "/client-conversations", label: "Jake's Conversations" },
            ]}
         />
         <div className="box full dfb column pd-1">
            <div className="text-l full bold-700">Jake's Conversations</div>
         </div>
         {clientId}
         <br /><br />
         <ConversationBox />
      </AppWrapper>
   )
}
