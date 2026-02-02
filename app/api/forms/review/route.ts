import { getClientFromClientId } from "@/app/actions/clients";
import { notifyClientAboutBadReview } from "@/app/actions/twilio-sms";
import { db } from "@/db";
import { badReviewsTable } from "@/db/schemas";
import { NextRequest, NextResponse } from "next/server";

const getCORSHeaders = () => {
   const headers = new Headers();
   headers.set('Access-Control-Allow-Origin', '*');
   headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
   headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
   return headers;
};

export async function OPTIONS() {
   return new NextResponse(null, {
      status: 204,
      headers: getCORSHeaders(),
   });
}

export async function POST (req: NextRequest) {
   const body = await req.json();
   const {
      name, email, feedback, minwebBusinessId: clientId
   } = body;
   
   
   if (feedback.trim() == "") {
      return NextResponse.json(JSON.stringify({ success: false }), { status: 200, headers: getCORSHeaders() })
   }

   try {
      const client = await getClientFromClientId(clientId);
      if (!client) return NextResponse.json(JSON.stringify({ success: false }), { status: 200, headers: getCORSHeaders() });

      // add bad review for the client
      const createdAt = Date.now().toString();
      const added = await db.insert(badReviewsTable).values({ clientId, name, email, review: feedback, createdAt });

      if (added) {
         // Notify Client about new bad review
         const sentNotification = await notifyClientAboutBadReview(client.clientid!);
         if (!sentNotification) return NextResponse.json(JSON.stringify({ success: false }), { status: 200, headers: getCORSHeaders() });
   
         return NextResponse.json(JSON.stringify({ success: true }), { status: 200, headers: getCORSHeaders() });
      } else {
         return NextResponse.json(JSON.stringify({ success: false }), { status: 200, headers: getCORSHeaders() });
      }
   } catch (e) {
      console.log(e);
      return NextResponse.json(JSON.stringify({ success: false }), { status: 200, headers: getCORSHeaders() });
   }
}
