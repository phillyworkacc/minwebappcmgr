import { dalDbOperation, dalRequireAuth, dalRequireAuthRedirect } from "@/dal/helpers"
import { db } from "@/db";
import { clientsTable } from "@/db/schemas";
import { and, desc, eq } from "drizzle-orm";
import ClientsPage from "./ClientsPage";
import LoadingPage from "../loading";


export async function generateMetadata() {
   return {
      title: `Minweb - Clients for Template Website System Build`
   };
}

export default async function Clients () {
   await dalRequireAuthRedirect();

   const allTWSClients = await dalRequireAuth(user =>
      dalDbOperation(async () => {
         const websiteBuildType = "template-build-site"
         const result = await db
            .select()
            .from(clientsTable)
            .orderBy(desc(clientsTable.createdat))
            .where(and(
               eq(clientsTable.userid, user.userid!),
               eq(clientsTable.websiteBuildType, websiteBuildType)
            ));

         return result;
      })
   )
   
   if (allTWSClients.success) {
      return <ClientsPage allClients={JSON.parse(JSON.stringify(allTWSClients.data))} />
   } else {
      return <LoadingPage />;
   }

   return <ClientsPage allClients={JSON.parse(JSON.stringify(allTWSClients))} />

}
