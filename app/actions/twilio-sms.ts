"use server"
import { db } from "@/db";
import { clientsTable, conversationsTable, messagesTable } from "@/db/schemas";
import { uuid } from "@/utils/uuid";
import { and, eq } from "drizzle-orm";
import twilio from "twilio";

export async function sendSMSMessage (fromClientTwilioPhoneNumber: string, receivingPhoneNumber: string, message: string) {
   try {
      if (!process.env.TWILIO_ACCOUNT_SID) return {
         success: false,
         error: "NO ACCOUNT SID"
      }
      
      if (!process.env.TWILIO_AUTH_TOKEN) return {
         success: false,
         error: "NO AUTH TOKEN"
      }
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      
      await client.messages.create({
         body: message,
         from: fromClientTwilioPhoneNumber,
         to: receivingPhoneNumber,
      })

      return {
         success: true,
         result: `SMS Message sent to ${receivingPhoneNumber}`
      }
   } catch (e) {
      console.error(e)
      return {
         success: false,
         error: "Failed to send sms message"
      }
   }
}

export async function createNewMessage (clientId: string, conversationId: string, body: string, direction: "in" | "out") {
   try {
      const now = `${Date.now()}`;
      const messageId = uuid().replaceAll("-","_");
      // create message
      await db.insert(messagesTable).values({
         messageId, conversationId,
         body, direction, date: now
      })
   
      // update conversation
      await db.update(conversationsTable)
         .set({ lastMessageId: messageId })
         .where(and(
            eq(conversationsTable.clientId, clientId),
            eq(conversationsTable.conversationId, conversationId)
         ));

      return true;
   } catch (e) {
      console.log(e);
      return false;
   }
}

type ConversationCustomer = {
   customerName: string;
   customerPhone: string;
}

export async function createNewMessageUpsertConversation (clientId: string, messageBody: string, customer: ConversationCustomer, direction: "in" | "out") {
   try {
      const conversations = await db.select().from(conversationsTable)
         .where(and(
            eq(conversationsTable.clientId, clientId),
            eq(conversationsTable.customerPhone, customer.customerPhone)
         )).limit(1);
      
      if (conversations.length > 0) {
         // if conversation exists just create a message
         const createMsg = await createNewMessage(clientId, conversations[0].conversationId!, messageBody, direction);
         return createMsg;
      } else {
         // if conversation doesn't exist then just create a conversation and a message
         const createConvo = await createNewConversation(clientId, messageBody, customer, direction);
         return createConvo;
      }
   } catch (e) {
      console.log(e);
      return false;
   }
}

export async function createNewConversation (clientId: string, messageBody: string, customer: ConversationCustomer, direction: "in" | "out") {
   try {
      const now = `${Date.now()}`;
      const messageId = uuid().replaceAll("-","_");
      const conversationId = uuid();
   
      // create message
      await db.insert(messagesTable).values({
         messageId, conversationId,
         body: messageBody, direction, date: now
      })
   
      // create conversation
      await db.insert(conversationsTable).values({
         conversationId, clientId,
         customerName: customer.customerName,
         customerPhone: customer.customerPhone,
         lastMessageId: messageId
      })

      return true;
   } catch (e) {
      console.log(e);
      return false;
   }
}

export async function notifyClient (clientId: string, customerPhone: string, notificationType: "quote" | "message") {
   try {
      // get customer from customer phone
      const convos = await db.select()
         .from(conversationsTable)
         .where(and(
            eq(conversationsTable.clientId, clientId),
            eq(conversationsTable.customerPhone, customerPhone)
         )).limit(1);
      
      if (convos.length < 1) return false;

      const customer: ConversationCustomer = {
         customerName: convos[0].customerName!,
         customerPhone: convos[0].customerPhone!
      }

      // customize notification message
      const notificationMessage = 
         (notificationType == "quote") ? `New quote request from ${customer.customerName || 'a customer'}.
Log in to view and respond.` : `New message from ${customer.customerName || 'a customer'}.
Log in to reply.`;
   
      // get client
      const dbClients = await db.select().from(clientsTable).where(eq(clientsTable.clientid, clientId)).limit(1);
   
      // if no client exists return false
      if (dbClients.length < 1) return false;
    
      // send message
      const sentNotificationSms = await sendSMSMessage(dbClients[0].twilioPhoneNumber!, dbClients[0].phoneNumber!, notificationMessage);
      return sentNotificationSms.success;
   } catch (e) {
      console.log(e);
      return false;
   }
}