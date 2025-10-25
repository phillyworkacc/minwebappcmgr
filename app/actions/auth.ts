"use server"
import { dalDbOperation } from "@/dal/helpers";
import { db } from "@/db";
import { usersTable } from "@/db/schemas";
import { hashPwd } from "@/utils/uuid";
import { and, eq } from "drizzle-orm";

export async function userEmailExists (email: string) {
   const userExists = await dalDbOperation(async () => {
      const res = await db.select()
         .from(usersTable)
         .where(eq(usersTable.email, email))
         .limit(1);
      
      return (res.length > 0);
   })
   console.log(userExists)
   return userExists;
}

export async function userLogIn (email: string, password: string) {
   const logUserIn = await dalDbOperation(async () => {
      const res = await db.select()
         .from(usersTable)
         .where(and(
            eq(usersTable.email, email),
            eq(usersTable.password, hashPwd(password))
         ))
         .limit(1);
      return (res.length > 0);
   })
   return logUserIn;
}