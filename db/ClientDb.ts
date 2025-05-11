import { keygen } from "@/utils/keygen";
import { pool } from "./db";

export const ClientsDB = {
   getAllClients: async (userid: string): Promise<Client[]> => {
      const res: any = await pool.query("SELECT * FROM clients WHERE userid = $1", [userid]);
      return res.rows as Client[];
   },

   getClientOnlyCID: async (clientid: string) => {
      const res: any = await pool.query("SELECT * FROM clients WHERE clientid = $1", [clientid]);
      return res.rows.length > 0 ? res.rows[0] as Client : false;
   },
  
   getClient: async (userid: string, clientid: string) => {
      const res: any = await pool.query("SELECT * FROM clients WHERE userid = $1 AND clientid = $2", [userid, clientid]);
      return res.rows.length > 0 ? res.rows[0] as Client : false;
   },
  
   add: async (client: Omit<Client, 'clientid' | 'notes' | 'status' | 'review'>) => {
      const clientid = keygen.cid();
      const res = await pool.query(
        "INSERT INTO clients (userid, clientid, name, description, image, notes, status, review, createdat, latestupdate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
        [client.userid, clientid, client.name, client.description, client.image, '', 'beginning', '', client.createdat, client.latestupdate]
      );
      return res.rowCount === 1;
   },
  
   updateClientNote: async (userid: string, clientid: string, newNotes: string, latestUpdate: string) => {
      const res = await pool.query(
        "UPDATE clients SET notes = $1, latestupdate = $2 WHERE userid = $3 AND clientid = $4",
        [newNotes, latestUpdate, userid, clientid]
      );
      return res.rowCount === 1;
   },
  
   updateClientStatus: async (userid: string, clientid: string, newStatus: ClientStatus, latestUpdate: string) => {
      const res = await pool.query(
         "UPDATE clients SET status = $1, latestupdate = $2 WHERE userid = $3 AND clientid = $4",
         [newStatus, latestUpdate, userid, clientid]
      );
      return res.rowCount === 1;
   },

   addClientReview: async (clientid: string, review: string, latestUpdate: string) => {
      const res = await pool.query(
         "UPDATE clients SET review = $1, latestupdate = $2 WHERE clientid = $3",
         [review, latestUpdate, clientid]
      );
      return res.rowCount === 1;
   },
  
   delete: async (userid: string, clientid: string) => {
      const res = await pool.query(
         "DELETE FROM clients WHERE userid = $1 AND clientid = $2",
         [userid, clientid]
      );
      return res.rowCount === 1;
   }
}