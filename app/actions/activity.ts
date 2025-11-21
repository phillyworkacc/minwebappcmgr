"use server"
import { dalDbOperation, dalRequireAuth } from "@/dal/helpers";
import { db } from "@/db";
import { activitiesTable, clientsTable } from "@/db/schemas";
import { uuid } from "@/utils/uuid";
import { and, asc, desc, eq } from "drizzle-orm";


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

export async function addActivity (title: string, priority: ActivityPriority, dueDate: string, clientid: string) {
   const activityId = uuid().replaceAll('-','');
   const now = `${Date.now()}`
   const addedActivity = await dalRequireAuth(user => 
      dalDbOperation(async () => {
         const res = await db.insert(activitiesTable)
            .values({
               activityId, userid: user.userid!, clientid,
               title, priority, markdownDescriptionText: "",
               completed: false, completeDate: "", dueDate,
               date: now,
            })
         return (res.rowCount > 0);
      })
   )
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