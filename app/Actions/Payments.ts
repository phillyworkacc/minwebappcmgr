"use server"

import { PaymentsDB } from "@/db/PaymentsDb";
import { getUserServer } from "./User";

export async function getRecentPaymentsData (): Promise<Payment[] | false> {
   try {
      const payments = await PaymentsDB.getAllRecentPayments();
      return JSON.parse(JSON.stringify(payments));
   } catch (err) {
      return false;
   }
}

export async function getAllTimePaymentsData (): Promise<Payment[] | false> {
   try {
      const payments = await PaymentsDB.getAllPayments();
      return JSON.parse(JSON.stringify(payments));
   } catch (err) {
      return false;
   }
}

export async function addPayment (clientId: string, amount: string, reason: string): Promise<boolean> {
   try {
      const user = await getUserServer();
      if (!user) return false;

      const res = await PaymentsDB.insert({
         userid: user.userid,
         clientid: clientId,
         amount: amount,
         text: reason,
         date: `${Date.now()}`
      });

      return res;
   } catch (err) {
      return false;
   }
}