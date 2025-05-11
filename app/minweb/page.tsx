import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import MinwebUserTackerPage from "./Minweb";

export default async function MinwebTracker() {
   const session = await getServerSession(authOptions);
   
   if (session?.user) {
      return <MinwebUserTackerPage />
   } else {
      redirect('/login')
   }
}