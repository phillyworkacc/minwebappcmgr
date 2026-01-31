"use server"
import { dalDbOperation, dalRequireAuth } from "@/dal/helpers";
import { db } from "@/db";
import { automationRunsTable, automationsTable } from "@/db/schemas";
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

export async function getAutomation (automationId: string): Promise<Automation | false> {
   try {
      const res = await db.select().from(automationsTable)
         .where(eq(automationsTable.automationId, automationId)).limit(1);
      return (res.length > 0) ? res[0] as any : false;
   } catch (e) {
      console.error(e);
      return false;
   }
}

export async function logAutomationExecution (automationId: string, clientId: string, conversationId: string, customerPhone: string, delay: number) {
   try {
      const runAt = Date.now() + delay;
      await db.insert(automationRunsTable).values({
         automationId, clientId, conversationId, customerPhone, runAt,
         status: "pending"
      });
   } catch (e) {
      console.log(e);
   }
}

export async function markAutomationRun (automationId: string, runAt: number, status: "pending" | "complete" | "fail") {
   try {
      await db.update(automationRunsTable)
         .set({ status })
         .where(and(
            eq(automationRunsTable.automationId, automationId),
            eq(automationRunsTable.runAt, runAt)
         ));
   } catch (e) {
      console.log(e);
   }
}

export async function runAutomation (clientId: string, conversationId: string, customerPhone: string, type: "review" | "referral") {
   try {
      const automations = await db.select().from(automationsTable)
         .where(and(
            eq(automationsTable.clientId, clientId),
            eq(automationsTable.type, type),
            eq(automationsTable.enabled, true)
         )).limit(1);
      
      if (automations.length > 0) {
         await logAutomationExecution(automations[0].automationId!, clientId, conversationId, customerPhone, automations[0].delay!);
      } else {
         return false;
      }
   } catch (err) {
      console.error(err);
      return false;
   }
}