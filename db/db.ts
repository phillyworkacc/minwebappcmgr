import dotenv from 'dotenv'
import { Pool } from 'pg';

dotenv.config();

export const pool = new Pool({
   connectionString: process.env.NEON_DB,
   ssl: {
      rejectUnauthorized: false, // Needed for Neon and many managed DBs
   },
})