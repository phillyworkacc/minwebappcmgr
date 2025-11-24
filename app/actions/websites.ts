"use server"
import { dalDbOperation, dalRequireAuth } from "@/dal/helpers";
import { db } from "@/db";
import { clientsTable, websitesTable } from "@/db/schemas";
import { and, eq } from "drizzle-orm";
import { uuid } from "@/utils/uuid";

export async function addWebsite (clientId: string, websiteUrl: string) {
   const addedWebsite = await dalRequireAuth(user =>
      dalDbOperation(async () => {
         const websiteid = `website-url-${uuid().substring(0,20)}`;
         const now = `${Date.now()}`
         const res = await db
            .insert(websitesTable)
            .values({
               userid: user.userid!,
               clientid: clientId,
               websiteid,
               url: websiteUrl,
               date: now
            });
         
         const res2 = await db
            .update(clientsTable)
            .set({
               websites: clientsTable.websites + `${websiteUrl},`
            })
            .where(and(
               eq(clientsTable.clientid, clientId),
               eq(clientsTable.userid, user.userid!),
            ))
         
         return (res.rowCount === 1 && res2.rowCount === 1);
      })
   )
   return addedWebsite;
}

export async function removeWebsiteFromClient (clientId: string, websiteid: string, clientWebsiteIds: string) {
   const deletedWebsite = await dalRequireAuth(user =>
      dalDbOperation(async () => {
         const newClientWebsites = clientWebsiteIds.split(",").filter(w => (w !== websiteid && w !== '')).join(",");
         const res = await db
            .delete(websitesTable)
            .where(and(
               eq(websitesTable.userid, user.userid!),
               eq(websitesTable.clientid, clientId!),
               eq(websitesTable.websiteid, websiteid)
            ));
         
         const res2 = await db
            .update(clientsTable)
            .set({ websites: newClientWebsites })
            .where(and(
               eq(clientsTable.clientid, clientId),
               eq(clientsTable.userid, user.userid!),
            ))
         
         return (res.rowCount === 1 && res2.rowCount === 1);
      })
   );
   return deletedWebsite;
}