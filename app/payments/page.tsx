import { dalDbOperation, dalRequireAuth, dalRequireAuthRedirect } from "@/dal/helpers"
import { db } from "@/db";
import { clientsTable, paymentsTable } from "@/db/schemas";
import { desc, eq } from "drizzle-orm";
import PaymentsPage from "./PaymentsPage";
import LoadingPage from "../loading";

export default async function Payments () {
   await dalRequireAuthRedirect();

   const allClientPayments = await dalRequireAuth(user =>
      dalDbOperation(async () => {
         const result = await db
            .select({
               client: {
                  clientid: clientsTable.clientid,
                  name: clientsTable.name,
                  image: clientsTable.image
               },
               amount: paymentsTable.amount,
               text: paymentsTable.text,
               date: paymentsTable.date
            })
            .from(paymentsTable)
            .innerJoin(clientsTable, eq(clientsTable.clientid, paymentsTable.clientid))
            .orderBy(desc(paymentsTable.date))
            .where(eq(paymentsTable.userid, user.userid!));

         return result;
      })
   )

   if (allClientPayments.success) {
      return <PaymentsPage allPayments={JSON.parse(JSON.stringify(allClientPayments.data))} />
   } else {
      return <LoadingPage />;
   }
}
