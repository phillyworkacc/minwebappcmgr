import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AddClientsPage from "./AddClientsPage";

export default async function AddClients() {
   const session = await getServerSession(authOptions);
   
   if (session?.user) {
      return <AddClientsPage />
   } else {
      redirect('/login')
   }
}