import { dalDbOperation, dalRequireAuth, dalRequireAuthRedirect } from "@/dal/helpers"
import { db } from "@/db";
import { clientsTable } from "@/db/schemas";
import { and, desc, eq } from "drizzle-orm";
import ClientsPage from "./ClientsPage";
import LoadingPage from "../loading";


export async function generateMetadata() {
   return {
      title: `Minweb - Clients`
   };
}

export default async function Clients () {
   await dalRequireAuthRedirect();

   const allClients = await dalRequireAuth(user =>
      dalDbOperation(async () => {
         const customBuildWebsiteType = "custom-build";
         const result = await db
            .select()
            .from(clientsTable)
            .orderBy(desc(clientsTable.createdat))
            .where(and(
               eq(clientsTable.userid, user.userid!),
               eq(clientsTable.websiteBuildType, customBuildWebsiteType)
            ));

         return result;
      })
   )

   if (allClients.success) {
      return <ClientsPage allClients={JSON.parse(JSON.stringify(allClients.data))} />
   } else {
      return <LoadingPage />;
   }
}
