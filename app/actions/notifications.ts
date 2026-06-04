"use server"
import { db } from "@/db";
import { pushNotificationsTable } from "@/db/schemas";
import { eq } from "drizzle-orm";

export async function getSubscriptionsForClient (clientId: string) {
   try {
      const userPushNotificationsSubscriptions = await db.select()
         .from(pushNotificationsTable)
         .where(eq(pushNotificationsTable.clientId, clientId));
      
      return userPushNotificationsSubscriptions;
   } catch (err) {
      return [];
   }
}