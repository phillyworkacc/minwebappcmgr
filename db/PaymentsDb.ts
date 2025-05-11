import { pool } from "./db";

export const PaymentsDB = {
   getAllPayments: async (): Promise<Payment[]> => {
      const res: any = await pool.query("SELECT * FROM payments ORDER BY date DESC");
      return res.rows as Payment[];
   },

   getAllRecentPayments: async (): Promise<Payment[]> => {
      const res: any = await pool.query("SELECT * FROM payments ORDER BY date DESC LIMIT 3");
      return res.rows as Payment[];
   },

   insert: async (data: Payment) => {
      const res = await pool.query(
        "INSERT INTO payments (userid, clientid, amount, text, date) VALUES ($1, $2, $3, $4, $5)",
        [data.userid, data.clientid, data.amount, data.text, data.date]
      );
      return res.rowCount === 1;
   }
}