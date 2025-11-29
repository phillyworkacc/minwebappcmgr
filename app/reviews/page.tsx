import { dalDbOperation, dalRequireAuth, dalRequireAuthRedirect } from "@/dal/helpers"
import { db } from "@/db";
import { clientsTable } from "@/db/schemas";
import { eq } from "drizzle-orm";
import ReviewsPage from "./ReviewsPage";
import LoadingPage from "./loading";

export async function generateMetadata() {
   return {
      title: `Minweb - Reviews`
   };
}

export default async function Reviews () {
   await dalRequireAuthRedirect();

   const reviews = await dalRequireAuth(user => 
      dalDbOperation(async () => {
         const result = await db.select()
            .from(clientsTable)
            .where(eq(clientsTable.userid, user.userid!));

         return result
            .map(res => (res.review?.split("@@!!@@").filter(r => r!=='').map(r => ({
               client: {
                  clientid: res.clientid,
                  name: res.name,
                  image: res.image
               },
               review: r
         })))).flatMap(r => r);
      })
   )

   if (reviews.success) {
      return <ReviewsPage reviews={JSON.parse(JSON.stringify(reviews.data))} />
   } else {
      return <LoadingPage />
   }
}
