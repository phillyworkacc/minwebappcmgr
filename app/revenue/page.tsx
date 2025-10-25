import { dalDbOperation, dalRequireAuth, dalRequireAuthRedirect } from "@/dal/helpers"
import { clientsTable, paymentsTable } from "@/db/schemas";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import RevenuePage from "./RevenuePage";
import LoadingPage from "./loading";

export default async function Revenue () {
   await dalRequireAuthRedirect();

   const allInfo = await dalRequireAuth(user =>
      dalDbOperation(async () => {
         const payments = await db
            .select()
            .from(paymentsTable)
            .where(eq(paymentsTable.userid, user.userid!));
            
         const clients = await db
            .select()
            .from(clientsTable)
            .where(eq(clientsTable.userid, user.userid!));

         return { clients, payments };
      })
   )

   if (allInfo.success) {
      return <RevenuePage 
         clients={JSON.parse(JSON.stringify(allInfo.data.clients))}
         payments={JSON.parse(JSON.stringify(allInfo.data.payments))}
      />
   } else {
      return <LoadingPage />
   }


}
