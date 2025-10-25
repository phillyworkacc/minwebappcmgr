import { dalRequireAuthRedirect } from "@/dal/helpers";
import AccountPage from "./Account";

export default async function Account() {
   const user = await dalRequireAuthRedirect();
   return <AccountPage user={user} />;
}