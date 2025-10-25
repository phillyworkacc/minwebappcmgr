"use server"
import { dalDbOperation, dalRequireAuth } from "@/dal/helpers";
import { db } from "@/db";
import { paymentsTable } from "@/db/schemas";
import { and, desc, eq } from "drizzle-orm";

export async function getRecentPaymentsData () {
   const payments = await dalRequireAuth(user => 
      dalDbOperation(async () => {
         const res = await db.select()
            .from(paymentsTable)
            .where(eq(paymentsTable.userid, user.userid!))
            .orderBy(desc(paymentsTable.date))
            .limit(3)
         return res;
      })
   )
   return payments;
}

export async function getAllTimePaymentsData () {
   const payments = await dalRequireAuth(user => 
      dalDbOperation(async () => {
         const res = await db.select()
            .from(paymentsTable)
            .where(eq(paymentsTable.userid, user.userid!))
            .orderBy(desc(paymentsTable.date));
         return res;
      })
   )
   return payments;
}

export async function addPayment (clientId: string, amount: string, reason: string) {
   const addedPayment = await dalRequireAuth(user => 
      dalDbOperation(async () => {
         const now = `${Date.now()}`
         const res = await db.insert(paymentsTable)
            .values({
               userid: user.userid!,
               clientid: clientId,
               amount: amount,
               text: reason,
               date: now
            })
         return (res.rowCount > 0);
      })
   )
   return addedPayment;
}

export async function deletePayment (clientId: string, paymentDate: string, paymentAmount: string) {
   const deleted = await dalRequireAuth(user =>
      dalDbOperation(async () => {
         const res = await db
            .delete(paymentsTable)
            .where(and(
               eq(paymentsTable.userid, user.userid!),
               eq(paymentsTable.clientid, clientId),
               eq(paymentsTable.amount, paymentAmount),
               eq(paymentsTable.date, paymentDate)
            ));
         return (res.rowCount > 0);
      })
   )
   return deleted;
}