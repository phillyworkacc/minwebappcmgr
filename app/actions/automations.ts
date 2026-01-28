"use server"
import { dalDbOperation, dalRequireAuth } from "@/dal/helpers";
import { db } from "@/db";
import { automationsTable } from "@/db/schemas";
import { and, eq } from "drizzle-orm";

export async function updateAutomation (automationId: string, clientId: string, automationUpdate: Automation) {
   const updated = await dalRequireAuth(user =>
      dalDbOperation(async () => {
         const res = await db.update(automationsTable)
            .set({
               delay: automationUpdate.delay,
               message: automationUpdate.message,
               enabled: automationUpdate.enabled,
            })
            .where(and(
               eq(automationsTable.automationId, automationId),
               eq(automationsTable.clientId, clientId)
            ))
         
         return (res.rowCount > 0);
      })
   )
   return updated;
}