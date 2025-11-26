import { NextResponse } from "next/server";
import { db } from "@/db";
import { activitiesTable, clientsTable } from "@/db/schemas";
import { and, eq, gte, lte } from "drizzle-orm";
import activityEmail from "@/emails/activityEmail";
import nodemailer from "nodemailer";

export const runtime = 'nodejs';

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
      try {
         const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            host: "smtp.gmail.com",
            port: 465,
            auth: {
               user: 'agencyminweb@gmail.com',
               pass: process.env.GOOGLE_APP_PASSWORD!
            },
         });
      
         await transporter.sendMail({
            from: `"Minweb Agency" <agencyminweb@gmail.com>`,
            to: "ayomiposi.opadijo@gmail.com",
            subject: "Activities Due Soon",
            html: activityEmail(tasksAwaitingFinish)
         });

         await db
            .update(activitiesTable)
            .set({ notified: true })
            .where(and(
               lte(activitiesTable.dueDate, now + oneDay),
               gte(activitiesTable.dueDate, now),
               eq(activitiesTable.notified, false),
               eq(activitiesTable.completed, false)
            ));
         
         return NextResponse.json({ ok: "Sent email successfully" }, { status: 200 });
      } catch (e) {
         return NextResponse.json({ res: "Failed to send email or update db" }, { status: 500 });
      }
   }
}
