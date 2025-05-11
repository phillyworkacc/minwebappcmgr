import { pool } from "./db";

export const UserTrackerDB = {
   getAllTrackingData: async (): Promise<UserTrackingData[]> => {
      const res: any = await pool.query("SELECT * FROM usertracker ORDER BY time DESC");
      return res.rows as UserTrackingData[];
   },

   getAllRecentTrackingData: async (): Promise<UserTrackingData[]> => {
      const res: any = await pool.query("SELECT * FROM usertracker ORDER BY time DESC LIMIT 3");
      return res.rows as UserTrackingData[];
   },

   insert: async (data: UserTrackingData) => {
      const res = await pool.query(
        "INSERT INTO usertracker (location, time, utmsource, device, os, page) VALUES ($1, $2, $3, $4, $5, $6)",
        [data.location, `${data.time}`, data.utmsource, data.device, data.os, data.page]
      );
      return res.rowCount === 1;
   }
}