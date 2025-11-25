"use server"
import { dalDbOperation, dalRequireAuth } from "@/dal/helpers";
import { db } from "@/db";
import { activitiesTable, clientsTable } from "@/db/schemas";
import { uuid } from "@/utils/uuid";
import { and, asc, desc, eq } from "drizzle-orm";
import { google } from "googleapis";

export async function getAllUserActivities () {
   const activities = await dalRequireAuth(user =>
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
            .orderBy(asc(activitiesTable.dueDate))
            .innerJoin(clientsTable, eq(clientsTable.clientid, activitiesTable.clientid))
            .where(and(
               eq(activitiesTable.userid, user.userid!),
               eq(activitiesTable.completed, false)
            ))
            .limit(4);

         return result;
      })
   )
   return activities
}

export async function addActivityToGoogleCalendar (activity: Activity, client: Client | null) {
   if (client == null) return;
   try {
      const googleServiceAccountJson = Buffer.from(
         process.env.GOOGLE_SERVICE_ACCOUNT_JSON!, "base64"
      ).toString("utf8");
      const credentials = JSON.parse(googleServiceAccountJson);
   
      const auth = new google.auth.GoogleAuth({
         credentials,
         scopes: ["https://www.googleapis.com/auth/calendar"],
      });
   
      const calendar = google.calendar({ version: "v3", auth });
      const googleColorMap: Record<ActivityPriority, string> = {
         high: "11", // Tomato
         medium: "6", // Tangerine
         low: "2" // Sage
      }
   
      const event = await calendar.events.insert({
         calendarId: "ayomiposi.opadijo@gmail.com",
         requestBody: {
            summary: activity.title,
            description: `This activity is for ${client.name}`,
            colorId: googleColorMap[activity.priority],
            start: { dateTime: new Date(activity.dueDate).toISOString() },
            end: { dateTime: new Date(activity.dueDate + 10*60*1000).toISOString() },
            reminders: {
               useDefault: false,
               overrides: [
                  { method: "popup", minutes: 30 }
               ]
            }
         },
      });
      console.log(event.data.id);
   } catch (e) {
      console.log(e);
   }
}

export async function addActivity (title: string, priority: ActivityPriority, dueDate: string, clientid: string) {
   const activityId = uuid().replaceAll('-','');
   const now = `${Date.now()}`
   const addedActivity = await dalRequireAuth(user => 
      dalDbOperation(async () => {
         const res = await db.insert(activitiesTable)
            .values({
               activityId, userid: user.userid!, clientid,
               title, priority, markdownDescriptionText: "",
               completed: false, completeDate: "", dueDate: parseInt(dueDate),
               date: now
            })
         return (res.rowCount > 0);
      })
   )

   if (addedActivity) {
      const activity: Activity = {
         id: 0, activityId, userid: '', clientid,
         title, priority, markdownDescriptionText: "",
         completed: false, completeDate: "", dueDate: parseInt(dueDate),
         date: now
      };
      const client = await dalRequireAuth(user => 
         dalDbOperation(async () => {
            const res = await db
               .select()
               .from(clientsTable)
               .where(and(
                  eq(clientsTable.userid, user.userid!),
                  eq(clientsTable.clientid, clientid)
               )).limit(1);
            return res[0];
         })
      );
      await addActivityToGoogleCalendar(activity, client.success ? client.data as any : null);
   }

   return {
      success: addedActivity,
      activityId
   };
}

export async function updateActivityMarkdown (activityId: string, markdown: string) {
   const updated = await dalRequireAuth(user => 
      dalDbOperation(async () => {
         const res = await db
            .update(activitiesTable)
            .set({ markdownDescriptionText: markdown })
            .where(and(
               eq(activitiesTable.activityId, activityId),
               eq(activitiesTable.userid, user.userid!)
            ));

         return (res.rowCount > 0);
      })
   )
   if (updated.success) {
      return updated.data;
   } else {
      return updated.success;
   }
}

export async function updateActivityCompletion (activityId: string, completed: boolean) {
   const completeDate = completed ? `${Date.now()}` : '';
   const updated = await dalRequireAuth(user => 
      dalDbOperation(async () => {
         const res = await db
            .update(activitiesTable)
            .set({ completed, completeDate })
            .where(and(
               eq(activitiesTable.activityId, activityId),
               eq(activitiesTable.userid, user.userid!)
            ));

         return (res.rowCount > 0);
      })
   )
   if (updated.success) {
      return updated.data;
   } else {
      return updated.success;
   }
}

export async function deleteActivity (activityId: string) {
   const updated = await dalRequireAuth(user => 
      dalDbOperation(async () => {
         const res = await db
            .delete(activitiesTable)
            .where(and(
               eq(activitiesTable.activityId, activityId),
               eq(activitiesTable.userid, user.userid!)
            ));

         return (res.rowCount > 0);
      })
   )
   if (updated.success) {
      return updated.data;
   } else {
      return updated.success;
   }
}