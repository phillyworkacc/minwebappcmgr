import { defineConfig } from "drizzle-kit";

if (!process.env.NEON_DB) {
   throw new Error("No process.env.DATABASE_URL");
}

export default defineConfig({
   out: './drizzle',
   schema: './db/schemas.ts',
   dialect: 'postgresql',
   dbCredentials: {
      url: process.env.NEON_DB
   }
})