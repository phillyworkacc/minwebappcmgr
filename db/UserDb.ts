import { keygen } from "@/utils/keygen";
import { pool } from "./db";

export const UsersDB = {
   login: async (email: string, password: string) => {
      const res: any = await pool.query(
        "SELECT * FROM users WHERE email = $1 AND password = $2 LIMIT 1",
        [email, password]
      );
      return res.rows.length > 0 ? res.rows[0] as User : false;
   },
  
   getAllUsers: async (): Promise<User[]> => {
      const res: any = await pool.query("SELECT * FROM users");
      return res.rows as User[];
   },
  
   getUser: async (email: string) => {
      const res: any = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      return res.rows.length > 0 ? res.rows[0] as User : false;
   },
  
   getUserById: async (userid: string) => {
      const res: any = await pool.query("SELECT * FROM users WHERE userid = $1", [userid]);
      return res.rows.length > 0 ? res.rows[0] as User : false;
   },
  
   insert: async (user: Omit<User, 'userid' | 'color_theme'>) => {
      const userid = keygen.uid();
      const res = await pool.query(
        "INSERT INTO users (userid, name, email, password, color_theme) VALUES ($1, $2, $3, $4, $5)",
        [userid, user.name, user.email, user.password, 'light']
      );
      return res.rowCount === 1;
   },
  
   changePwd: async (email: string, newPassword: string) => {
      const res = await pool.query(
        "UPDATE users SET password = $1 WHERE email = $2",
        [newPassword, email]
      );
      return res.rowCount === 1;
   },
  
   changeName: async (email: string, newName: string) => {
      const res = await pool.query(
        "UPDATE users SET name = $1 WHERE email = $2",
        [newName, email]
      );
      return res.rowCount === 1;
   },

   changeColorTheme: async (email: string, newTheme: ColorTheme) => {
      const res = await pool.query(
        "UPDATE users SET color_theme = $1 WHERE email = $2",
        [newTheme, email]
      );
      return res.rowCount === 1;
   },
  
   resetPwd: async (userid: string, newPassword: string) => {
      const res = await pool.query(
         "UPDATE users SET password = $1 WHERE userid = $2",
         [newPassword, userid]
      );
      return res.rowCount === 1;
   },
  
   delete: async (email: string) => {
      const res = await pool.query(
         "DELETE FROM users WHERE email = $1",
         [email]
      );
      return res.rowCount === 1;
   }
}