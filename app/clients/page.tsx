import { dalDbOperation, dalRequireAuth, dalRequireAuthRedirect } from "@/dal/helpers"
import { db } from "@/db";
import { clientsTable } from "@/db/schemas";
import { desc, eq } from "drizzle-orm";
import ClientsPage from "./ClientsPage";
import LoadingPage from "../loading";

export default async function Clients () {
   await dalRequireAuthRedirect();

   const allClients = await dalRequireAuth(user =>
      dalDbOperation(async () => {
         const result = await db
            .select()
            .from(clientsTable)
            .orderBy(desc(clientsTable.createdat))
            .where(eq(clientsTable.userid, user.userid!));

         return result;
      })
   )

   if (allClients.success) {
      return <ClientsPage allClients={JSON.parse(JSON.stringify(allClients.data))} />
   } else {
      return <LoadingPage />;
   }
}
