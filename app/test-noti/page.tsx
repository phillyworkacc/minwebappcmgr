import webpush from "@/utils/webpush";
import { getSubscriptionsForClient } from "../actions/notifications";
import { getCurrentUser } from "../actions/user";


export default async function page() {
   const user = await getCurrentUser();

   if (!user) return (<>no user</>)

   const userSubscriptions: any[] = await getSubscriptionsForClient(user.email);
   
   for (const userSubscription of userSubscriptions) {
      await webpush.sendNotification(
         userSubscription.subscription as any,
         JSON.stringify({
            title: "Testing Title",
            body: `Complete this for Philly before todal`,
            url: `/`,
         })
      );
   }

   return (<>notification sent</>)
}
