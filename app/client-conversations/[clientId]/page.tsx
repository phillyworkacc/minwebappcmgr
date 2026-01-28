import { dalDbOperation, dalRequireAuth } from "@/dal/helpers";
import { db } from "@/db";
import { clientsTable, conversationsTable, messagesTable } from "@/db/schemas";
import { and, eq } from "drizzle-orm";
import LoadingPage from "./loading";
import ClientConversations from "./ClientConversations";

type ClientConversationsProps = {
   params: Promise<{
      clientId: string;
   }>
}

export async function generateMetadata() {
   return {
      title: `Minweb - Client Conversations`
   };
}

export default async function ClientConversationsPage ({ params }: ClientConversationsProps) {
   const { clientId } = await params;

   const allClientConversations = await dalRequireAuth(user =>
      dalDbOperation(async () => {
         const clientInfo = await db
            .select()
            .from(clientsTable)
            .where(eq(clientsTable.clientid, clientId)).limit(1);
         
         const clientConversations = await db
            .select({
               conversationId: conversationsTable.conversationId,
               clientId: conversationsTable.clientId,
               customerName: conversationsTable.customerName,
               customerPhone: conversationsTable.customerPhone,
               lastMessage: {
                  body: messagesTable.body, 
                  direction: messagesTable.direction, 
                  date: messagesTable.date
               }
            })
            .from(conversationsTable)
            .innerJoin(messagesTable, and(
               eq(messagesTable.conversationId, conversationsTable.conversationId),
               eq(messagesTable.messageId, conversationsTable.lastMessageId)
            ))
            .where(eq(conversationsTable.clientId, clientId));

         return { clientInfo, clientConversations };
      })
   )
   
   if (allClientConversations.success) {
      return <ClientConversations
         clientInfo={JSON.parse(JSON.stringify(allClientConversations.data.clientInfo[0]))} 
         clientConversations={JSON.parse(JSON.stringify(allClientConversations.data.clientConversations))}
      />
   } else {
      return <LoadingPage />;
   }
}
