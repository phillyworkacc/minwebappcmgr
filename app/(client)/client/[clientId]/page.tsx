import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ClientPage from "./ClientPage";

type ClientDynamicPageProps = {
   params: Promise<{
      clientId: string
   }>
}

export default async function ClientDynamic ({ params }: ClientDynamicPageProps) {
   const { clientId } = await params;
   const session = await getServerSession(authOptions);
   
   if (session?.user) {
      return <ClientPage clientId={clientId} />
   } else {
      redirect('/login')
   }
}