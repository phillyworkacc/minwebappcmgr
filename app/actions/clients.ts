"use server"
import { dalDbOperation, dalRequireAuth } from "@/dal/helpers";
import { db } from "@/db";
import { automationsTable, clientsTable } from "@/db/schemas";
import { and, eq } from "drizzle-orm";
import { hashPwd, uuid } from "@/utils/uuid";

export async function getAllUserClients () {
   const clients = await dalRequireAuth(user =>
      dalDbOperation(async () => {
         const res = await db.select()
            .from(clientsTable)
            .where(eq(clientsTable.userid, user.userid!));
         
         return res;
      })
   )
   return clients;
}

export async function getClientFromPhoneNumber (clientPhoneNumber: string) {
   try {
      const res = await db.select()
         .from(clientsTable)
         .where(eq(clientsTable.phoneNumber, clientPhoneNumber))
         .limit(1);
      return (res.length > 0) ? res[0] : undefined;
   } catch (e) {
      return undefined;
   }
}

export async function getClientFromTwilioPhone (twilioPhoneNumber: string) {
   try {
      const res = await db.select()
         .from(clientsTable)
         .where(eq(clientsTable.twilioPhoneNumber, twilioPhoneNumber))
         .limit(1);
      return (res.length > 0) ? res[0] : undefined;
   } catch (e) {
      return undefined;
   }
}

export async function getClientFromClientId (clientId: string) {
   try {
      const res = await db.select()
         .from(clientsTable)
         .where(eq(clientsTable.clientid, clientId))
         .limit(1);
      return (res.length > 0) ? res[0] : undefined;
   } catch (e) {
      return undefined;
   }
}

export async function getInfoForReviewClient (clientId: string) {
   const clients: any = await dalDbOperation(async () => {
      const res = await db.select()
         .from(clientsTable)
         .where(eq(clientsTable.clientid, clientId))
         .limit(1);
      
      return res;
   })
   return clients[0];
}

export async function sendReviewForClient (clientId: string, review: string) {
   const result: any = await dalDbOperation(async () => {
      const client = await db.select()
         .from(clientsTable)
         .where(eq(clientsTable.clientid, clientId));
      
      const reviews = [review, ...client[0]?.review?.split("@@!!@@")!].join("@@!!@@");
      const now = `${Date.now()}`;

      const res = await db.update(clientsTable)
         .set({
            review: reviews,
            latestupdate: now
         })
         .where(eq(clientsTable.clientid, clientId));
      
      return (res.rowCount > 0);
   })
   return result;
}

export async function createUserClient (name: string, email: string, phoneNumber: string, description: string, image: string) {
   const now = `${Date.now()}`;
   const clientid = uuid().replaceAll("-","");
   const websiteBuildType = "custom-build";
   const inserted = await dalRequireAuth(user =>
      dalDbOperation(async () => {
         const res = await db.insert(clientsTable).values({
            userid: user.userid, clientid, email,
            name, description, image, phoneNumber,
            twilioPhoneNumber: "", websites: "", websiteBuildType,
            notes: "", status: "beginning", review: "",
            latestupdate: now, createdat: now
         });
         return (res.rowCount > 0);
      })
   )
   return inserted
}

export async function createUserClientTws (
   name: string, email: string, phoneNumber: string, description: string, image: string,
   businessName: string, twilioPhoneNumber: string, password: string
) {
   const now = `${Date.now()}`;
   const clientid = uuid().replaceAll("-","");
   const websiteBuildType = "template-build-site";
   const hashedPassword = hashPwd(password)

   const inserted = await dalRequireAuth(user =>
      dalDbOperation(async () => {
         const res = await db.insert(clientsTable).values({
            userid: user.userid, 
            clientid, email, name, description, image, phoneNumber,
            twilioPhoneNumber, websites: "", websiteBuildType, businessName,
            password: hashedPassword, notes: "", status: "beginning", review: "",
            latestupdate: now, createdat: now
         });

         const automationId1 = uuid();
         const automationId2 = uuid();
         const reviewMessage = `Hi {{customer_name}}, thanks for choosing {{business_name}}!
If you have 30 seconds, we'd really appreciate a quick review: {{review_link}}
— {{business_name}}`;
         const referralMessage = `Hi {{customer_name}}, hope you're doing well!
If you know anyone who could use {{business_name}}, we offer {{referral_reward}} as a thank you for referrals.
Just have them mention your name 😊`;

         const res2 = await db.insert(automationsTable).values([
            {
               automationId: automationId1, clientId: clientid, type: "review",
               message: reviewMessage, delay: 1800000, enabled: false
            },
            {
               automationId: automationId2, clientId: clientid, type: "referral",
               message: referralMessage, delay: 1800000, enabled: false
            }
         ])
         return (res.rowCount > 0 && res2.rowCount > 0);
      })
   )
   return inserted
}

export async function getUserClientInfo (clientId: string) {
   const client = await dalRequireAuth(user =>
      dalDbOperation(async () => {
         const res = await db.select()
            .from(clientsTable)
            .where(and(
               eq(clientsTable.userid, user.userid!),
               eq(clientsTable.clientid, clientId)
            ))
            .limit(1);
         return res[0];
      })
   )
   return client;
}

export async function deleteClientAccount (clientId: string) {
   const deleted = await dalRequireAuth(user =>
      dalDbOperation(async () => {
         const res = await db
            .delete(clientsTable)
            .where(and(
               eq(clientsTable.userid, user.userid!),
               eq(clientsTable.clientid, clientId)
            ));
         return (res.rowCount > 0);
      })
   )
   return deleted;
}

export async function changeClientPassword (clientId: string, newPassword: string) {
   const hashedPassword = hashPwd(newPassword);
   const changed = await dalRequireAuth(user =>
      dalDbOperation(async () => {
         const res = await db.update(clientsTable)
            .set({ password: hashedPassword })
            .where(and(
               eq(clientsTable.userid, user.userid!),
               eq(clientsTable.clientid, clientId)
            ));
         return (res.rowCount > 0);
      })
   )
   return changed
}

export async function updateClientInfoStatus (clientId: string, newStatus: ClientStatus) {
   const now = `${Date.now()}`;
   const result = await dalRequireAuth(user =>
      dalDbOperation(async () => {
         const res = await db.update(clientsTable)
            .set({
               status: newStatus,
               latestupdate: now
            })
            .where(and(
               eq(clientsTable.userid, user.userid!),
               eq(clientsTable.clientid, clientId)
            ));
         return (res.rowCount > 0);
      })
   )
   return result
}

export async function editClientProfile (
   clientid: string,
   newInfo: { name: string, desc: string, email: string, image: string }
) {
   const result = await dalRequireAuth(user =>
      dalDbOperation(async () => {
         const res = await db.update(clientsTable)
            .set({
               name: newInfo.name, description: newInfo.desc,
               email: newInfo.email, image: newInfo.image
            })
            .where(and(
               eq(clientsTable.userid, user.userid!),
               eq(clientsTable.clientid, clientid)
            ));
         return (res.rowCount > 0);
      })
   )
   return result
}

export async function editClientTWSProfile (
   clientid: string,
   newInfo: {
      name: string, desc: string, email: string, image: string,
      twilioPhoneNumber: string, businessPhoneNumber: string, businessName: string
   }
) {
   const result = await dalRequireAuth(user =>
      dalDbOperation(async () => {
         const res = await db.update(clientsTable)
            .set({
               name: newInfo.name, description: newInfo.desc,
               email: newInfo.email, image: newInfo.image,
               twilioPhoneNumber: newInfo.twilioPhoneNumber,
               phoneNumber: newInfo.businessPhoneNumber,
               businessName: newInfo.businessName
            })
            .where(and(
               eq(clientsTable.userid, user.userid!),
               eq(clientsTable.clientid, clientid)
            ));
         return (res.rowCount > 0);
      })
   )
   return result
}

export async function updateClientInfoNotes (clientId: string, newNotes: string) {
   const now = `${Date.now()}`;
   const result = await dalRequireAuth(user =>
      dalDbOperation(async () => {
         const res = await db.update(clientsTable)
            .set({
               notes: newNotes,
               latestupdate: now
            })
            .where(and(
               eq(clientsTable.userid, user.userid!),
               eq(clientsTable.clientid, clientId)
            ));
         return (res.rowCount > 0);
      })
   )
   return result;
}