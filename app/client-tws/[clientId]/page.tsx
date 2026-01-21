import { dalDbOperation, dalRequireAuth, dalRequireAuthRedirect } from "@/dal/helpers"
import { db } from "@/db";
import { clientsTable, paymentsTable, websitesTable } from "@/db/schemas";
import { and, eq } from "drizzle-orm";
import LoadingPage from "./loading";
import ClientPage from "./ClientPage";

type ClientProps = {
   params: Promise<{
      clientId: string;
   }>
}

export async function generateMetadata() {
   return {
      title: `Minweb - Client Page`
   };
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
         
         const websites = await db
            .select()
            .from(websitesTable)
            .where(and(
               eq(websitesTable.userid, user.userid!),
               eq(websitesTable.clientid, clientId)
            ));

         const clientPayments = await db
            .select()
            .from(paymentsTable)
            .where(and(
               eq(paymentsTable.userid, user.userid!),
               eq(paymentsTable.clientid, clientId)
            ));

         return {
            client,
            websites,
            clientPayments: clientPayments.map(cp => ({
               client: {
                  clientid: client[0].clientid,
                  name: client[0].name,
                  image: client[0].image
               },
               amount: cp.amount,
               text: cp.text,
               date: cp.date
            }))
         };
      })
   )

   if (clientInfo.success) {
      return <ClientPage 
         client={JSON.parse(JSON.stringify(clientInfo.data.client[0]))}
         websites={JSON.parse(JSON.stringify(clientInfo.data.websites))}
         clientPayments={JSON.parse(JSON.stringify(clientInfo.data.clientPayments))}
      />
   } else {
      return <LoadingPage />;
   }
}
