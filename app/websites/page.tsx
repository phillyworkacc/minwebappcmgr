import { dalDbOperation, dalRequireAuth, dalRequireAuthRedirect } from "@/dal/helpers"
import { db } from "@/db";
import { clientsTable, websitesTable } from "@/db/schemas";
import { desc, eq } from "drizzle-orm";
import LoadingPage from "./loading";
import Websites from "./Websites";

export default async function Dashboard () {
   await dalRequireAuthRedirect();

   const allWebsitesData = await dalRequireAuth(user =>
      dalDbOperation(async () => {
         const result = await db.select({
               id: websitesTable.id,
               userid: websitesTable.userid,
               clientid: websitesTable.clientid,
               websiteid: websitesTable.websiteid,
               url: websitesTable.url,
               date: websitesTable.date,
               client: {
						id: clientsTable.id,
						userid: clientsTable.userid,
						clientid: clientsTable.clientid,
						name: clientsTable.name,
						description: clientsTable.description,
						image: clientsTable.image,
						notes: clientsTable.notes,
						status: clientsTable.status,
						websites: clientsTable.websites,
						review: clientsTable.review,
						latestupdate: clientsTable.latestupdate,
						createdat: clientsTable.createdat,
               }
            })
            .from(websitesTable)
            .innerJoin(clientsTable, eq(clientsTable.clientid, websitesTable.clientid))
            .where(eq(clientsTable.userid, user.userid!))
            .orderBy(desc(websitesTable.date));

         return result
      })
   )

   if (allWebsitesData.success) {
      return <Websites clientWebsites={allWebsitesData.data as any[]} />
   } else {
      return <LoadingPage />
   }
}
