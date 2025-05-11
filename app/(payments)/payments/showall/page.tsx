import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ShowAllPaymentsPage from "./ShowAllPayments";

export default async function ShowAllPayments() {
   const session = await getServerSession(authOptions);
   
   if (session?.user) {
      return <ShowAllPaymentsPage />
   } else {
      redirect('/login')
   }
}