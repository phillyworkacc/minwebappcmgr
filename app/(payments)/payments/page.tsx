import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import PaymentsPage from "./Payments";

export default async function Payments() {
   const session = await getServerSession(authOptions);
   
   if (session?.user) {
      return <PaymentsPage />
   } else {
      redirect('/login')
   }
}