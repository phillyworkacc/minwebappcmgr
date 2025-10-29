import "@/styles/app.css"
import { dalDbOperation } from "@/dal/helpers"
import { db } from "@/db";
import { clientsTable } from "@/db/schemas";
import { eq } from "drizzle-orm";
import LoadingPage from "./loading";
import ReviewPage from "./ReviewPage";

type ClientProps = {
   params: Promise<{
      clientId: string;
   }>
}

export default async function Client ({ params }: ClientProps) {
   const { clientId } = await params;

   const clientInfo = await dalDbOperation(async () => {
      const client = await db
         .select()
         .from(clientsTable)
         .where(
            eq(clientsTable.clientid, clientId)
         ).limit(1);

      return client;
   })

   if (clientInfo.success) {
      return <ReviewPage 
         client={JSON.parse(JSON.stringify(clientInfo.data[0]))}
      />
   } else {
      return <LoadingPage />;
   }
}
