import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AddPaymentFormPage from "./AddPaymentForm";

export default async function AddPayment() {
   const session = await getServerSession(authOptions);
   
   if (session?.user) {
      return <AddPaymentFormPage />
   } else {
      redirect('/login')
   }
}