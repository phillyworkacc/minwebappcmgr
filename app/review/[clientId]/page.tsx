import "@/styles/app.css"
import { dalDbOperation, dalRequireAuth, dalRequireAuthRedirect } from "@/dal/helpers"
import { db } from "@/db";
import { clientsTable } from "@/db/schemas";
import { and, eq } from "drizzle-orm";
import LoadingPage from "./loading";
import ReviewPage from "./ReviewPage";

type ClientProps = {
   params: Promise<{
      clientId: string;
   }>
}

export default async function Client ({ params }: ClientProps) {
   await dalRequireAuthRedirect();

   const { clientId } = await params;

   const clientInfo = await dalRequireAuth(user =>
      dalDbOperation(async () => {
         const client = await db
            .select()
            .from(clientsTable)
            .where(and(
               eq(clientsTable.userid, user.userid!),
               eq(clientsTable.clientid, clientId)
            )).limit(1);

         return client;
      })
   )

   if (clientInfo.success) {
      return <ReviewPage 
         client={JSON.parse(JSON.stringify(clientInfo.data[0]))}
      />
   } else {
      return <LoadingPage />;
   }
}
