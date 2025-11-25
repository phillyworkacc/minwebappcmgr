import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/sendEmail";
import { db } from "@/db";
import { activitiesTable, clientsTable } from "@/db/schemas";
import { and, eq, gte, lte } from "drizzle-orm";
import activityEmail from "@/emails/activityEmail";

export async function GET() {
   const now = Date.now();
   const oneDay = 24 * 60 * 60 * 1000;

   const tasksAwaitingFinish: any[] = await db
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
         lte(activitiesTable.dueDate, now + oneDay),
         gte(activitiesTable.dueDate, now),
         eq(activitiesTable.notified, false),
         eq(activitiesTable.completed, false)
      ));
   
   if (tasksAwaitingFinish.length > 0) {
      const notified = await sendEmail("ayomiposi.opadijo@gmail.com", "Activities Due Soon", activityEmail(tasksAwaitingFinish));
      if (notified) {
         await db
            .update(activitiesTable)
            .set({ notified: true })
            .where(and(
               lte(activitiesTable.dueDate, now + oneDay),
               gte(activitiesTable.dueDate, now),
               eq(activitiesTable.notified, false),
               eq(activitiesTable.completed, false)
            ));
      }
   }

   return NextResponse.json({ ok: true }, { status: 200 });
}
