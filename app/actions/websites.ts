"use server"
import { dalDbOperation, dalRequireAuth } from "@/dal/helpers";
import { db } from "@/db";
import { clientsTable, websitesTable } from "@/db/schemas";
import { and, eq } from "drizzle-orm";
import { uuid } from "@/utils/uuid";

export async function addWebsite (clientId: string, websiteUrl: string) {
   const websiteid = `website-url-${uuid().substring(0,20)}`;
   const addedWebsite = await dalRequireAuth(user =>
      dalDbOperation(async () => {
         const now = Date.now().toString();
         const res = await db
            .insert(websitesTable)
            .values({
               userid: user.userid!,
               clientid: clientId,
               websiteid,
               url: websiteUrl,
               date: now
            });
         
         return (res.rowCount === 1);
      })
   )
   return addedWebsite ? websiteid : false;
}

export async function removeWebsiteFromClient (clientId: string, websiteid: string, clientWebsiteIds: string) {
   const deletedWebsite = await dalRequireAuth(user =>
      dalDbOperation(async () => {
         const res = await db
            .delete(websitesTable)
            .where(and(
               eq(websitesTable.userid, user.userid!),
               eq(websitesTable.clientid, clientId!),
               eq(websitesTable.websiteid, websiteid)
            ));
         
         return (res.rowCount === 1);
      })
   );
   return deletedWebsite;
}