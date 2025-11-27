"use server"
import { dalDbOperation, dalRequireAuth } from "@/dal/helpers";
import { db } from "@/db";
import { clientFormsTable } from "@/db/schemas";
import { uuid } from "@/utils/uuid";
import { desc } from "drizzle-orm";

export async function createClientForm (clientForm: ClientForm) {
   const now = Date.now();
   const clientFormId = uuid().replaceAll("-","");
   const inserted = await dalRequireAuth(user =>
      dalDbOperation(async () => {
         const res = await db.insert(clientFormsTable).values({
            clientFormId,
            clientFormJson: JSON.stringify(clientForm),
            date: now
         });
         return (res.rowCount > 0);
      })
   )
   return inserted.success ? inserted.data : false;
}