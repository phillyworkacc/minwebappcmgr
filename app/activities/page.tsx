import { dalDbOperation, dalRequireAuth, dalRequireAuthRedirect } from "@/dal/helpers";
import { db } from "@/db";
import { activitiesTable, clientsTable } from "@/db/schemas";
import { desc, eq } from "drizzle-orm";
import ActivitiesPage from "./ActivitiesPage";
import LoadingPage from "./loading";

export default async function Activities () {
   await dalRequireAuthRedirect();
   
   const allActivities = await dalRequireAuth(user =>
      dalDbOperation(async () => {
         const result = await db
            .select({
               id: activitiesTable.id,
               activityId: activitiesTable.activityId,
               userid: activitiesTable.userid,
               clientid: activitiesTable.clientid,
               title: activitiesTable.title,
               priority: activitiesTable.priority,
               markdownDescriptionText: activitiesTable.markdownDescriptionText,
               completed: activitiesTable.completed,
               completeDate: activitiesTable.completeDate,
               dueDate: activitiesTable.dueDate,
               date: activitiesTable.date,
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
            .from(activitiesTable)
            .orderBy(desc(activitiesTable.date))
            .innerJoin(clientsTable, eq(clientsTable.clientid, activitiesTable.clientid))
            .where(eq(activitiesTable.userid, user.userid!));

         return result;
      })
   )

   if (allActivities.success) {
      return <ActivitiesPage allActivities={JSON.parse(JSON.stringify(allActivities.data))} />
   } else {
      return <LoadingPage />;
   }
}