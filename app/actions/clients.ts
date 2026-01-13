"use server"
import { dalDbOperation, dalRequireAuth } from "@/dal/helpers";
import { db } from "@/db";
import { clientsTable } from "@/db/schemas";
import { and, eq } from "drizzle-orm";
import { uuid } from "@/utils/uuid";

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

export async function createUserClient (name: string, email: string, phoneNumber: string, description: string, image: string, websiteBuildType: string) {
   const now = `${Date.now()}`;
   const clientid = uuid().replaceAll("-","");
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