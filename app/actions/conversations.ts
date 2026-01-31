"use server"
import { dalDbOperation, dalRequireAuth } from "@/dal/helpers";
import { db } from "@/db";
import { conversationsTable, jobsTable, messagesTable } from "@/db/schemas";
import { and, eq } from "drizzle-orm";
import { runAutomation } from "./automations";

export async function getConversationMessages (conversationId: string) {
   try {
      const messages = await dalRequireAuth(user =>
         dalDbOperation(async () => {
            const res = await db.select().from(messagesTable)
               .where(and(
                  eq(messagesTable.conversationId, conversationId)
               ));
            return res;
         })
      )
      return messages.success ? messages.data : [];
   } catch (e) {
      return false;
   }
}

export async function getConversation (conversationId: string): Promise<Conversation | false> {
   try {
      const res = await db.select().from(conversationsTable)
         .where(eq(conversationsTable.conversationId, conversationId)).limit(1);
      
      return (res.length > 0) ? res[0] as any : false;
   } catch (e) {
      console.error(e);
      return false;
   }
}

export async function getJobCompletion (conversationId: string, clientId: string, customerPhone: string) {
   try {
      const res = await db.select().from(jobsTable)
         .where(and(
            eq(jobsTable.conversationId, conversationId),
            eq(jobsTable.clientId, clientId),
            eq(jobsTable.customerPhone, customerPhone)
         )).limit(1);
      
      return (res.length > 0) 
         ? (typeof res[0].completedAt == "string") ? true : false
         : false;
   } catch (e) {
      console.error(e);
      return false;
   }
}

export async function markJobAsComplete (conversationId: string, clientId: string, customerPhone: string) {
   try {
      const now = Date.now().toString();
      const res = await db.insert(jobsTable).values({
         conversationId, clientId, customerPhone,
         completedAt: now
      });

      await runAutomation(clientId, conversationId, customerPhone, "review");

      return (res.rowCount > 0);
   } catch (e) {
      console.error(e);
      return false;
   }
}