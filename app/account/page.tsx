import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AccountPage from "./Account";

export default async function Account() {
   const session = await getServerSession(authOptions);
   
   if (session?.user) {
      return <AccountPage />
   } else {
      redirect('/login')
   }
}