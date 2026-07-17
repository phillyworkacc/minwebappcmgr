import { NextResponse } from "next/server";
import { db } from "@/db";
import { activitiesTable, clientsTable } from "@/db/schemas";
import { and, eq, gte, lte } from "drizzle-orm";
import { getSubscriptionsForClient } from "@/app/actions/notifications";
import { formatMilliseconds } from "@/utils/date";
import webpush from "@/utils/webpush";

const baseurl = "https://app.minwebagency.com";

export async function GET (request: Request) {
   // get search params
   const { searchParams } = new URL(request.url);
   const clientId = searchParams.get("clientId");

   if (!clientId) return NextResponse.json({ result: null }, { status: 200 });;
   
   const now = Date.now();
   const oneDay = 24 * 60 * 60 * 1000;

   const tasksAwaitingFinish: any[] = await db
      .select({
         activityId: activitiesTable.activityId,
         title: activitiesTable.title,
         dueDate: activitiesTable.dueDate,
         date: activitiesTable.date,
         client: {
            name: clientsTable.name
         }
      })
      .from(activitiesTable)
      .innerJoin(clientsTable, eq(clientsTable.clientid, activitiesTable.clientid))
      .where(and(
         lte(activitiesTable.dueDate, now + oneDay),
         gte(activitiesTable.dueDate, now),
         eq(activitiesTable.notified, false),
         eq(activitiesTable.completed, false)
      ));
   
   if (tasksAwaitingFinish.length > 0) {
      try {
         const userSubscriptions: any[] = await getSubscriptionsForClient(clientId!);
         
         for (const userSubscription of userSubscriptions) {
            for (const task of tasksAwaitingFinish) {
               await webpush.sendNotification(
                  userSubscription.subscription as any,
                  JSON.stringify({
                     title: task.title,
                     body: `Complete this for ${task.client.name} before ${formatMilliseconds(task.dueDate, false, true)}`,
                     url: `${baseurl}/activity/${task.activityId}`,
                  })
               );
            }
         }

         await db
            .update(activitiesTable)
            .set({ notified: true })
            .where(and(
               lte(activitiesTable.dueDate, now + oneDay),
               gte(activitiesTable.dueDate, now),
               eq(activitiesTable.notified, false),
               eq(activitiesTable.completed, false)
            ));
         
         return NextResponse.json({ ok: "Sent notification successfully" }, { status: 200 });
      } catch (e) {
         console.log(e);
         return NextResponse.json({ res: `Failed to notify user or update db: ${e}` }, { status: 500 });
      }
   }
   return NextResponse.json({ res: JSON.stringify(tasksAwaitingFinish) }, { status: 200 });
}