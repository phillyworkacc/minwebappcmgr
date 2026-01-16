"use server"
import { dalDbOperation, dalRequireAuth } from "@/dal/helpers";
import { db } from "@/db";
import { activitiesTable, clientFormsTable, clientsTable } from "@/db/schemas";
import { uuid } from "@/utils/uuid";
import { and, eq } from "drizzle-orm";
import { google } from "googleapis";
import { addActivityToGoogleCalendar } from "./activity";
import clientFormSubmissionEmail from "@/emails/clientFormSubmissionEmail";
import sendMail from "@/lib/sendMail";

export async function createClientForm (clientForm: ClientForm) {
   const now = Date.now();
   const clientFormId = uuid().replaceAll("-","");
   const inserted = await db
      .insert(clientFormsTable)
      .values({
         clientFormId,
         clientFormJson: JSON.stringify(clientForm),
         date: now
      });
   if (inserted.rowCount > 0) {
      const sentMail = await sendMail(
         'ayomiposi.opadijo@gmail.com', 'Client Form Submission',
         clientFormSubmissionEmail(
            clientFormId, 
            `${clientForm.your_information.first_name} ${clientForm.your_information.last_name}`,
            clientForm.your_information.email, clientForm.your_information.phone,
            clientForm.your_information.preferred_contact
         )
      );
      return ((inserted.rowCount > 0) && sentMail);
   } else {
      return false;
   }
}

export async function createClientUsingForm (name: string, email: string, notes: string, image: string, niche: string, phoneNumber: string, websiteBuildType: string) {
   const now = `${Date.now()}`;
   const clientid = uuid().replaceAll("-","");

   const alreadyExists = await dalRequireAuth(user =>
      dalDbOperation(async () => {
         const res = await db
            .select()   
            .from(clientsTable)
            .where(and(
               eq(clientsTable.userid, user.userid!),
               eq(clientsTable.email, email)
            ));
         return (res.length > 0);
      })
   );

   if (alreadyExists.success) {
      if (alreadyExists.data) {
         return {
            error: "Client already exists",
            success: alreadyExists.data,
         }
      }
   } else {
      return {
         error: "Failed to create client",
         success: false,
      }
   }

   const inserted = await dalRequireAuth(user =>
      dalDbOperation(async () => {
         const res = await db.insert(clientsTable).values({
            userid: user.userid, clientid, email,
            name, description: niche, image, phoneNumber,
            twilioPhoneNumber: "", websites: "", websiteBuildType,
            notes, status: "working", review: "",
            latestupdate: now, createdat: now
         });
         return (res.rowCount > 0);
      })
   )

   if (inserted.success) {
      return {
         error: inserted.data ? undefined : "Failed to create client",
         success: inserted.data,
      }
   } else {
      return {
         error: "Failed to create client",
         success: inserted.success
      }
   }
}

export async function addMeetingToGoogleCalendar (clientName: string, clientEmail: string, dueDate: number) {
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
   
      const event = await calendar.events.insert({
         calendarId: "ayomiposi.opadijo@gmail.com",
         requestBody: {
            summary: `Website Discussion - ${clientName} and Philip`,
            description: `Meeting with Client (${clientEmail})`,
            colorId: "9",
            start: { dateTime: new Date(dueDate).toISOString() },
            end: { dateTime: new Date(dueDate + 60*60*1000).toISOString() },
            reminders: {
               useDefault: false,
               overrides: [
                  { method: "popup", minutes: 30 }
               ]
            }
         },
      });
      return true;
   } catch (e) {
      console.log(e);
      return false;
   }
}

export async function addActivityFromClientForm (title: string, clientEmail: string, priority: ActivityPriority, description: string, dueDate: string) {
   const activityId = uuid().replaceAll('-','');
   const now = `${Date.now()}`

   const addedActivity = await dalRequireAuth(user => 
      dalDbOperation(async () => {
         const client = await db
            .select()
            .from(clientsTable)
            .where(eq(clientsTable.email, clientEmail))
            .limit(1);
         
         if (client.length > 0) {
            const res = await db.insert(activitiesTable)
               .values({
                  activityId, userid: user.userid!, clientid: client[0].clientid,
                  title, priority, markdownDescriptionText: description,
                  completed: false, completeDate: "", dueDate: parseInt(dueDate),
                  date: now, notified: false
               })
            return [(res.rowCount > 0), client[0].clientid];
         } else {
            return false;
         }
      })
   )

   if (addedActivity.success) {
      if (addedActivity.data !== false) {
         const [_, clientid] = addedActivity.data as any;
         const activity: Activity = {
            id: 0, activityId, userid: '', clientid,
            title, priority, markdownDescriptionText: "",
            completed: false, completeDate: "", dueDate: parseInt(dueDate),
            date: now, notified: false
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
         return true;
      } else {
         return false;
      }
   } else {
      return false;
   }
}

export async function deleteClientForm (clientFormId: string) {
   const updated = await dalRequireAuth(user => 
      dalDbOperation(async () => {
         const res = await db
            .delete(clientFormsTable)
            .where(eq(clientFormsTable.clientFormId, clientFormId));
         return (res.rowCount > 0);
      })
   )
   if (updated.success) {
      return updated.data;
   } else {
      return updated.success;
   }
}