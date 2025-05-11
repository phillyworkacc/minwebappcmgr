import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ShowAllMinwebPage from "./ShowAllMinweb";

export default async function ShowAllMinweb() {
   const session = await getServerSession(authOptions);
   
   if (session?.user) {
      return <ShowAllMinwebPage />
   } else {
      redirect('/login')
   }
}