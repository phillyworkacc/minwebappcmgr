import { getInfoForReviewClient } from "@/app/Actions/Clients";
import ClientReview from "./ClientReview";

type ClientReviewFormDynamicPageProps = {
   params: Promise<{
      clientId: string
   }>
}

export default async function ClientReviewFormDynamic ({ params }: ClientReviewFormDynamicPageProps) {
   const { clientId } = await params;
   const client = await getInfoForReviewClient(clientId)
   return <ClientReview client={client} />
}