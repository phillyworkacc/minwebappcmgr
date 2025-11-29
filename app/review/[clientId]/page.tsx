import "@/styles/app.css"
import { dalDbOperation } from "@/dal/helpers"
import { db } from "@/db";
import { clientsTable } from "@/db/schemas";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import LoadingPage from "./loading";
import ReviewPage from "./ReviewPage";
import DefaultClientImage from "@/public/clientdefault.jpg"

type ClientProps = {
   params: Promise<{
      clientId: string;
   }>
}

export async function generateMetadata({ params }: ClientProps): Promise<Metadata> {
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

   return {
      title: `${clientInfo.success ? clientInfo.data[0].name : "Client"} - Review`,
      icons: {
         icon: clientInfo.success ? clientInfo.data[0].image! : DefaultClientImage.src,
         apple: clientInfo.success ? clientInfo.data[0].image! : DefaultClientImage.src,
      },
   };
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
