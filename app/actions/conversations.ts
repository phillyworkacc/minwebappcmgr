"use server"
import { dalDbOperation, dalRequireAuth } from "@/dal/helpers";
import { db } from "@/db";
import { conversationsTable, messagesTable } from "@/db/schemas";
import { and, eq } from "drizzle-orm";

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