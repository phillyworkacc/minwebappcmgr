import { dalRequireAuth, dalDbOperation, dalRequireAuthRedirect } from "@/dal/helpers";
import { db } from "@/db";
import { clientFormsTable } from "@/db/schemas";
import { eq } from "drizzle-orm";
import LoadingPage from "./loading";
import ClientFormIndividualPage from "./ClientFormPage";

type ClientFormIndividualProps = {
   params: Promise<{
      clientFormId: string;
   }>
}

export default async function ClientFormIndividual ({ params }: ClientFormIndividualProps) {
   await dalRequireAuthRedirect();
   const { clientFormId } = await params;
   
   const clientForm = await dalRequireAuth(user =>
      dalDbOperation(async () => {
         const res = await db
            .select()
            .from(clientFormsTable)
            .where(eq(clientFormsTable.clientFormId, clientFormId))
            .limit(1);
         return res[0];
      })
   )

   if (clientForm.success) {
      return <ClientFormIndividualPage cfSubmission={JSON.parse(JSON.stringify(clientForm.data))} />
   } else {
      return <LoadingPage />
   }
}
