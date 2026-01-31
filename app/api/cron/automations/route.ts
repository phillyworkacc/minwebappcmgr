import { NextResponse } from "next/server";
import { db } from "@/db";
import { automationRunsTable, automationsTable } from "@/db/schemas";
import { and, eq, lte } from "drizzle-orm";
import { getConversation } from "@/app/actions/conversations";
import { getAutomation, markAutomationRun } from "@/app/actions/automations";
import { sendMessageToClientCustomer } from "@/app/actions/twilio-sms";
import { automationMessageConverter } from "@/utils/funcs";
import { getClientFromClientId } from "@/app/actions/clients";

export async function GET () {
   const now = Date.now();

   const automationsToRun: any[] = await db
      .select({
         automationId: automationRunsTable.automationId,
         conversationId: automationRunsTable.conversationId,
         clientId: automationRunsTable.clientId,
         status: automationRunsTable.status,
         customerPhone: automationRunsTable.customerPhone,
         runAt: automationRunsTable.runAt,
      })
      .from(automationRunsTable)
      .innerJoin(automationsTable, and(
         eq(automationsTable.automationId, automationRunsTable.automationId),
         eq(automationsTable.clientId, automationRunsTable.clientId)
      ))
      .where(and(
         eq(automationRunsTable.status, "pending"),
         lte(automationRunsTable.runAt, now),
      ));

   await Promise.allSettled(
      automationsToRun.map(async (automationToRun) => {
         try {
            const [conversation, automation, client] = await Promise.all([
               getConversation(automationToRun.conversationId),
               getAutomation(automationToRun.automationId),
               getClientFromClientId(automationToRun.clientId),
            ]);

            if (!conversation || !automation || !client) {
               console.log(conversation, automation, client)
               throw new Error("Missing data");
            }

            await sendMessageToClientCustomer(
               conversation.clientId,
               conversation.conversationId,
               conversation.customerPhone,
               automationMessageConverter(
                  automation.message,
                  conversation.customerName,
                  client.businessName!
               )
            );

            await markAutomationRun(automationToRun.automationId, automationToRun.runAt, "complete");
         } catch (err) {
            console.error("Automation run failed", err);
            await markAutomationRun(automationToRun.automationId, automationToRun.runAt, "fail");
         }
      })
   );
   
   return NextResponse.json("Automation Ran", { status: 200 });
}
