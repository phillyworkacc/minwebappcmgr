"use server"
import { dalDbOperation, dalRequireAuth } from "@/dal/helpers";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { usersTable } from "@/db/schemas";
import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth"

export async function getCurrentUser (): Promise<User | null> {
   try {
      const session = await getServerSession(authOptions);

      if (!session) return null;
      if (!session.user) return null;

      const user = await db.select().from(usersTable).where(eq(usersTable.email, session.user.email!)).limit(1);
      
      return user[0] as User;
   } catch (err) {
      return null;
   }
}