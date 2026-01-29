import { getClientFromTwilioPhone } from "@/app/actions/clients";
import { createNewConversation, createNewMessage, notifyClient } from "@/app/actions/twilio-sms";
import { db } from "@/db";
import { conversationsTable } from "@/db/schemas";
import { and, eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
   try {
      const formData = await req.formData();
   
      const from = formData.get("From") as string; // customer
      const to = formData.get("To") as string;     // Twilio number
      const body = formData.get("Body") as string;
      const messageSid = formData.get("MessageSid") as string;
   
      // Find client by Twilio number
      const client = await getClientFromTwilioPhone(to);
      if (!client) return new Response("No client", { status: 500 });
   
      // Find or create conversation
      const conversations = await db.select().from(conversationsTable)
         .where(and(
            eq(conversationsTable.clientId, client.clientid!),
            eq(conversationsTable.customerPhone, from)
         ));
      
      if (conversations.length < 1) {
         // if conversation doesn't exist create a new one
         const createConvo = await createNewConversation(client.clientid!, body, {
            customerName: `Unknown (${from.slice(-4)})`, customerPhone: from
         }, "in");
         if (!createConvo) throw new Error("Failed to create conversation");
      } else {
         // if it does create message
         const createMsg = await createNewMessage(client.clientid!, conversations[0].conversationId!, body, "in");
         if (!createMsg) throw new Error("Failed to create message");
      }
   
      // Notify client
      const sentNotification = await notifyClient(client.clientid!, from, "message");
      if (!sentNotification) throw new Error("Failed to send notification to client");
   
      return new Response("OK", { status: 200 });
   } catch (e) {
      console.log(e);
      return new Response("Error", { status: 500 });
   }
}
