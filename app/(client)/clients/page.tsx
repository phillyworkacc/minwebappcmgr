import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ClientsPage from "./ClientsPage";

export default async function Clients() {
   const session = await getServerSession(authOptions);
   
   if (session?.user) {
      return <ClientsPage />
   } else {
      redirect('/login')
   }
}