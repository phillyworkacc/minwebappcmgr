import { dalRequireAuth, dalDbOperation } from "@/dal/helpers";
import { db } from "@/db";
import { clientFormsTable } from "@/db/schemas";
import { desc } from "drizzle-orm";
import LoadingPage from "./loading";
import ClientFormsPage from "./ClientFormsPage";

export async function generateMetadata() {
   return {
      title: `Minweb - Client Forms`
   };
}

export default async function ClientForms () {
   const clientForms = await dalRequireAuth(user =>
      dalDbOperation(async () => {
         const res = await db
            .select()
            .from(clientFormsTable)
            .orderBy(desc(clientFormsTable.date));
         return res;
      })
   )

   if (clientForms.success) {
      return <ClientFormsPage clientFormsSubmissions={JSON.parse(JSON.stringify(clientForms.data))} />
   } else {
      return <LoadingPage />
   }
}
