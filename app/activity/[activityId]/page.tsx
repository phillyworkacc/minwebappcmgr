import { dalDbOperation, dalRequireAuth, dalRequireAuthRedirect } from "@/dal/helpers"
import { db } from "@/db";
import { activitiesTable, clientsTable } from "@/db/schemas";
import { and, eq } from "drizzle-orm";
import ActivityPage from "./Activity";
import LoadingPage from "./loading";

type ActivityProps = {
   params: Promise<{
      activityId: string;
   }>
}

export default async function Activity ({ params }: ActivityProps) {
   await dalRequireAuthRedirect();
   const { activityId } = await params;

   const activityInfo = await dalRequireAuth(user =>
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
            .innerJoin(clientsTable, eq(clientsTable.clientid, activitiesTable.clientid))
            .where(and(
               eq(activitiesTable.activityId, activityId),
               eq(activitiesTable.userid, user.userid!),
            )).limit(1);
         
         return result[0];
      })
   )

   if (activityInfo.success) {
      return <ActivityPage activityInfo={JSON.parse(JSON.stringify(activityInfo.data))} />
   } else {
      return <LoadingPage />
   }

}
